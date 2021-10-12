using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace Gallery.Api.Gateway.Models
{
    public class Page
    {
        [BsonId]
        public ObjectId PageId { get; set; }
        public int PageIndex { get; set; }
        public string PageTitle { get; set; }
        public List<GalleryItem> Items { get; set; }
    }
}