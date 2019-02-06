using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using BackendExamModel;

namespace BackendExamDAL
{
    public class DBContext : DbContext
    {
        public DBContext() : base("BackendExamDB") {
            Database.SetInitializer<DBContext>(null);
        }

        public DbSet<User> User { get; set; }
    }
}
