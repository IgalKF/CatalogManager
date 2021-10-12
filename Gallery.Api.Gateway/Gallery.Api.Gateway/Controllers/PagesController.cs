using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gallery.Api.Gateway.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace Gallery.Api.Gateway.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PagesController : ControllerBase
    {
        private readonly ILogger<ItemsController> logger;
        private readonly IConfiguration configuration;

        public PagesController(ILogger<ItemsController> logger, IConfiguration configuration)
        {
            this.logger = logger;
            this.configuration = configuration;
        }

        [HttpPut]
        public async Task Put([FromBody] Page page)
        {
            try
            {
                this.logger.LogDebug("Processing a gallery item..");
                var client = new MongoClient(this.configuration.GetConnectionString("GalleryDb"));
                var database = client.GetDatabase("GalleryDb");
                var collection = database.GetCollection<Page>("Page");

                int maxIndex = collection.Find(FilterDefinition<Page>.Empty).ToList().Any() ?
                        collection.Find(FilterDefinition<Page>.Empty).ToList().Max(c => c.PageIndex) :
                        0;

                page.PageIndex = maxIndex + 1;

                await collection.InsertOneAsync(page);
                this.logger.LogDebug("Gallery item was processed succesfully..");
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed to process the requested gallery item.");
                throw;
            }
        }

        [HttpPut]
        [Route("[action]")]
        public async Task AddItem([FromBody] Page page)
        {
            try
            {
                this.logger.LogDebug("Processing a gallery item..");
                var client = new MongoClient(this.configuration.GetConnectionString("GalleryDb"));
                var database = client.GetDatabase("GalleryDb");
                var collection = database.GetCollection<Page>("Page");

                await collection.InsertOneAsync(page);
                this.logger.LogDebug("Gallery item was processed succesfully..");
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed to process the requested gallery item.");
                throw;
            }
        }

        [HttpPost]
        public async Task Post([FromBody] Page page)
        {
            try
            {
                this.logger.LogDebug("Updating a gallery item..");
                var client = new MongoClient(this.configuration.GetConnectionString("GalleryDb"));
                var database = client.GetDatabase("GalleryDb");
                var collection = database.GetCollection<Page>("Page");
                await collection.UpdateOneAsync(p => p.PageIndex == page.PageIndex, Builders<Page>.Update.Set(p => p.Items, page.Items));
                this.logger.LogDebug("Gallery item was updated succesfully..");
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed to update the requested gallery item.");
                throw;
            }
        }

        [HttpPost]
        [Route("UpdateTitle")]
        public async Task UpdateTitle([FromBody] Page page)
        {
            try
            {
                this.logger.LogDebug("Updating a gallery item..");
                var client = new MongoClient(this.configuration.GetConnectionString("GalleryDb"));
                var database = client.GetDatabase("GalleryDb");
                var collection = database.GetCollection<Page>("Page");
                await collection.UpdateOneAsync(p => p.PageIndex == page.PageIndex, Builders<Page>.Update.Set(p => p.PageTitle, page.PageTitle));
                this.logger.LogDebug("Gallery item was updated succesfully..");
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed to update the requested gallery item.");
                throw;
            }
        }

        [HttpPost]
        [Route("UpdateAll")]
        public async Task UpdateAll([FromBody] List<Page> pages)
        {
            try
            {
                this.logger.LogDebug("Updating a gallery item..");
                var client = new MongoClient(this.configuration.GetConnectionString("GalleryDb"));
                var database = client.GetDatabase("GalleryDb");
                var collection = database.GetCollection<Page>("Page");
                await collection.DeleteManyAsync(FilterDefinition<Page>.Empty);
                await collection.InsertManyAsync(pages);
                this.logger.LogDebug("Gallery item was updated succesfully..");
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed to update the requested gallery item.");
                throw;
            }
        }

        [HttpGet]
        public async Task<IEnumerable<Page>> Get()
        {
            try
            {
                this.logger.LogDebug("Retrieving a gallery items..");
                var client = new MongoClient(this.configuration.GetConnectionString("GalleryDb"));
                var database = client.GetDatabase("GalleryDb");
                var collection = database.GetCollection<Page>("Page");
                this.logger.LogDebug("Gallery items where retrieved succesfully..");

                var list = await collection.Find(FilterDefinition<Page>.Empty).ToListAsync();

                list.ForEach(page => page.Items = page.Items.OrderBy(item => item.Index).ToList());

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
