using Gallery.Api.Gateway.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Gallery.Api.Gateway.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly ILogger<ItemsController> logger;
        private readonly IConfiguration configuration;

        public ItemsController(ILogger<ItemsController> logger, IConfiguration configuration)
        {
            this.logger = logger;
            this.configuration = configuration;
        }

        [HttpPut]
        public async Task Put([FromBody] GalleryItem galleryItem)
        {
            try
            {
                this.logger.LogDebug("Processing a gallery item..");
                var client = new MongoClient(this.configuration.GetConnectionString("GalleryDb"));
                var database = client.GetDatabase("GalleryDb");
                var collection = database.GetCollection<Page>("Page");
                var items = (await collection.FindAsync(p => p.PageIndex == galleryItem.PageId)).FirstOrDefault().Items;
                
                if (items is null)
                    throw new ArgumentNullException("The page wasn't found.");

                items.Add(galleryItem);
                await collection.UpdateOneAsync(p => p.PageIndex == galleryItem.PageId, Builders<Page>.Update.Set(p => p.Items, items));
                this.logger.LogDebug("Gallery item was processed succesfully..");
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed to process the requested gallery item.");
                throw;
            }
        }

        [HttpPost]
        public async Task Post([FromBody] GalleryItem galleryItem)
        {
            try
            {
                this.logger.LogDebug("Processing a gallery item..");
                var client = new MongoClient(this.configuration.GetConnectionString("GalleryDb"));
                var database = client.GetDatabase("GalleryDb");
                var collection = database.GetCollection<Page>("Page");
                var items = (await collection.FindAsync(p => p.PageIndex == galleryItem.PageId)).FirstOrDefault().Items;
                
                if (items is null)
                    throw new ArgumentNullException("The page wasn't found.");

                items.RemoveAll(item => item.ImageId == galleryItem.ImageId);
                items.Add(galleryItem);

                await collection.UpdateOneAsync(
                    p => p.PageIndex == galleryItem.PageId, 
                    Builders<Page>.Update.Set(p => p.Items, items));
                this.logger.LogDebug("Gallery item was processed succesfully..");
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed to process the requested gallery item.");
                throw;
            }
        }

        [HttpDelete]
        [Route("{itemId}")]
        public async Task Delete(Guid itemId)
        {
            try
            {
                this.logger.LogDebug("Processing a gallery item..");
                var client = new MongoClient(this.configuration.GetConnectionString("GalleryDb"));
                var database = client.GetDatabase("GalleryDb");
                var collection = database.GetCollection<Page>("Page");
                var parentPage = (await collection.FindAsync(FilterDefinition<Page>.Empty))
                    .ToList()
                    .FirstOrDefault(p => p.Items
                        .Select(item => item.ImageId)
                        .Contains(itemId));
                var items = parentPage.Items;

                if (items is null)
                    throw new ArgumentNullException("The page wasn't found.");

                items.RemoveAll(item => item.ImageId == itemId);
                await collection.UpdateOneAsync(p => p.PageIndex == parentPage.PageIndex, Builders<Page>.Update.Set(p => p.Items, items));

                var dir = Directory.GetFiles(Path.Combine(Directory.GetCurrentDirectory(),"Media"), $"{itemId.ToString()}.*");

                System.IO.File.Delete(dir.FirstOrDefault());

                this.logger.LogDebug("Gallery item was processed succesfully..");
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed to process the requested gallery item.");
                throw;
            }
        }

        [HttpGet]
        [Route("{pageId}")]
        public async Task<IEnumerable<GalleryItem>> Get(int pageId)
        {
            try
            {
                this.logger.LogDebug("Retrieving gallery items..");
                var client = new MongoClient(this.configuration.GetConnectionString("GalleryDb"));
                var database = client.GetDatabase("GalleryDb");
                var collection = database.GetCollection<Page>("Page");
                this.logger.LogDebug("Gallery items where retrieved succesfully..");

                var list = (await collection.FindAsync(p => p.PageIndex == pageId)).FirstOrDefault().Items;

                return list;
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed to process the requested gallery item.");
                throw;
            }
        }
    }
}
