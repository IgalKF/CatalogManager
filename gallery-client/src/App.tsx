import './App.css';
import fetchCatalog, { createPage, fetchProperties } from './services/catalog-service';
import ItemUploader from './components/item-uploader/item-uploader';
import GalleryItem from './components/gallery-item/gallery-item';
import { CSSProperties, FormEvent, useEffect, useState } from 'react';
import { GalleryItemInfo } from './models/GalleryItem';
import GalleryPage from './components/gallery-page/gallery-page';
import { Page } from './models/Page';
import ColorPickerButtons from './components/color-picker/color-picker';
import FrontPage from './components/front-page/front-page';
import { BgColors, Properties } from './models/Properties';
import { PageSorter } from './components/page-sorter/page-sorter';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {

  const [addPageForm, setAddPageForm] = useState(false);
  const [pages, setPages] = useState<Array<Page>>([]);
  const [willPrint, setWillPrint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bgColors, setBgColors] = useState<BgColors>({ higher: '#eee', lower: '#ccc', title: '#eee' });
  const [properties, setProperties] = useState<Properties>({ Id: 1, bgColors: { higher: '#eee', lower: '#ccc', title: '#eee' }, askBeforeItemRemoval: true });

  const AddPage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    createPage({ items: [], pageTitle: formData.values().next().value });
    setAddPageForm(false);
    const newPages = [...pages];
    newPages.push({ items: [], pageTitle: formData.values().next().value, pageIndex: pages.length + 1, initialIndex: pages.length + 1 })
    setPages(newPages);
  }

  const loadingStyle: CSSProperties = {
    position: 'fixed',
    top: 10,
    border: 'none',
    fontSize: '50px',
    color: 'white'
  }

  const addPageButtonStyle: CSSProperties = {
    position: 'fixed',
    right: 10,
    bottom: 10,
    height: '100px',
    width: '100px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'darkblue',
    fontSize: '50px',
    color: 'white'
  }

  const pageAdditionInputStyle: CSSProperties = {
    height: '100%',
    fontSize: '20px',
    fontFamily: 'AlphaRegular',
    direction: 'rtl',
  }

  const pageAdditionFormStyle: CSSProperties = {
    display: addPageForm ? 'block' : 'none',
    position: 'fixed',
    right: 130,
    bottom: 50,
  }
  const buttonStyle: CSSProperties = {
    position: 'fixed',
    bottom: 10,
    left: 10,
    zIndex: 100,
    height: '100px',
    width: '100px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: 'green',
    color: 'white',
    fontWeight: 900,
    fontSize: '20px'
  }

  const printPdf = () => {
    setWillPrint(true);
  }

  useEffect(() => {
    if (willPrint) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        window.print();
      }, 1000);

      setTimeout(() => {
        setWillPrint(false);
      }, 2000)
    }
  }, [willPrint]);

  useEffect(() => {
    const fetchCatalogAsync = async () => {
      const response = await fetchCatalog();
      setPages(response.data.map((p) => {
        p.initialIndex = p.pageIndex;
        return p;
      }));
    }

    const fetchColors = async () => {
      const props = await fetchProperties();
      setProperties(props.data);
      setBgColors(props.data.bgColors);
    }

    fetchColors();
    fetchCatalogAsync();
  }, []);

  const getPages = (pages.map((p, i) => <GalleryPage pages={pages} setPages={setPages} bgColors={bgColors} key={p.initialIndex} willPrint={willPrint} data={p} />));

  return (
    <div id="app" className="App">
      {loading ? <h1 style={loadingStyle}>טוען...</h1>: null}
      <header className="App-header">
      <DndProvider backend={HTML5Backend}>
        <FrontPage lastPage={false} bgColors={bgColors} willPrint={willPrint} />
        {getPages}
        {willPrint ? null : <PageSorter pages={pages} setPages={setPages} />}
        {willPrint ? null : <ColorPickerButtons properties={properties} setBgColors={setBgColors} />}
        {willPrint ? null : <button style={addPageButtonStyle} onClick={() => setAddPageForm(!addPageForm)}>+</button>}
        <form onSubmit={AddPage} style={pageAdditionFormStyle}>
          <input style={pageAdditionInputStyle} name='title' type='text' />
        </form>
        {willPrint ? null : <button style={buttonStyle} onClick={printPdf}>PDF</button>}
        <FrontPage lastPage={true} bgColors={bgColors} willPrint={willPrint} />
      </DndProvider>
      </header>
    </div>
  );
}

export default App;
