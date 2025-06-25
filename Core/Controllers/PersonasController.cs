
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;

namespace Atlas_CORE_WebAPI_NET7.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonasController : ControllerBase
    {
        private readonly IConfiguration _config;

        public PersonasController(IConfiguration config)
        {
            _config = config;
        }

        public class PersonaDTO
        {
            public int Operacion { get; set; }
            public int? IdPersona { get; set; }
            public string? Nombre { get; set; }
            public string? Apellido1 { get; set; }
            public string? Apellido2 { get; set; }
            public long? Telefono { get; set; }
            public string? Correo { get; set; }
        }

        [HttpPost("mantenimiento")]
        public IActionResult Mantenimiento([FromBody] PersonaDTO persona)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("sp_Mantenimiento_Persona", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@Operacion", persona.Operacion);
                        cmd.Parameters.AddWithValue("@IdPersona", (object?)persona.IdPersona ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@Nombre", (object?)persona.Nombre ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@Apellido1", (object?)persona.Apellido1 ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@Apellido2", (object?)persona.Apellido2 ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@Telefono", (object?)persona.Telefono ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@Correo", string.IsNullOrWhiteSpace(persona.Correo) ? DBNull.Value : persona.Correo);

                        cmd.ExecuteNonQuery();
                    }
                }

                return Ok("✅ Operación ejecutada correctamente.");
            }
            catch (Exception ex)
            {
                return BadRequest("❌ Error: " + ex.Message);
            }
        }
    }
}
