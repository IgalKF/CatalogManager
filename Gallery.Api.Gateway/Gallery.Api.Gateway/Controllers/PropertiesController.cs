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
    public class PropertiesController : ControllerBase
    {
        private readonly ILogger<PropertiesController> logger;
        private readonly IConfiguration configuration;

        public PropertiesController(ILogger<PropertiesController> logger, IConfiguration configuration)
        {
            this.logger = logger;
            this.configuration = configuration;
        }

        [HttpPost]
        public async Task Post([FromBody] Properties properties)
        {
            try
            {
                properties.Id = 1;
                this.logger.LogDebug("Processing a gallery item..");
                var client = new MongoClient(this.configuration.GetConnectionString("GalleryDb"));
                var database = client.GetDatabase("GalleryDb");
                var collection = database.GetCollection<Properties>("Properties");

                await collection.FindOneAndReplaceAsync(p => p.Id == 1, properties);
                this.logger.LogDebug("Gallery item was processed succesfully..");

            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed getting the requested properties..");
                throw;
            }
        }

        [HttpGet]
        public async Task<Properties> Get()
        {
            try
            {
                this.logger.LogDebug("Processing a gallery item..");
                var client = new MongoClient(this.configuration.GetConnectionString("GalleryDb"));
                var database = client.GetDatabase("GalleryDb");
                var collection = database.GetCollection<Properties>("Properties");

                this.logger.LogDebug("Gallery item was processed succesfully..");

                var props = await collection.FindAsync(FilterDefinition<Properties>.Empty);

                if (!props.Any())
                {
                    await collection.InsertOneAsync(new()
                    {
                        Id = 1,
                        AskBeforeItemRemoval = true,
                        BgColors = new()
                        {
                            Higher = "#00f8ff",
                            Lower = "#222A5E",
                            Title = "#49c5e0",
                        }
                    });
                }

                var result = await collection.Find(FilterDefinition<Properties>.Empty).FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed getting the requested properties..");
                throw;
            }
        }
    }
}
