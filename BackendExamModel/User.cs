using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Principal;

namespace BackendExamModel
{
    [Table("users", Schema = "dbo")]
    public class User
    {
        [Key]
        public int user_id { get; set; }
        [Required]
        public string user_nm { get; set; }
        [Required]
        public int user_ty { get; set; }
        [Required]
        public string first_nm { get; set; }
        [Required]
        public string last_nm { get; set; }
        [Required]
        public string phone_nb { get; set; }
        [Required]
        public string email_ad { get; set; }
        public string address_tx { get; set; }
        public string notes_tx { get; set; }
        public DateTime? birth_dt { get; set; }
        public bool active_yn { get; set; }
        
        [NotMapped]
        public virtual bool loggedin_yn { get; set; }
        [NotMapped]
        public virtual string remarks_tx { get; set; }
    }

    interface CustomIPrincipal : IPrincipal
    {
        int user_id { get; set; }
        string user_nm { get; set; }
        string full_nm { get; set; }
        string user_ty { get; set; }
    }

    public class Custom2IPrincipal : CustomIPrincipal
    {
        public IIdentity Identity { get; private set; }

        public bool IsInRole(string role) { return false; }

        public Custom2IPrincipal(String UserId)
        {
            this.Identity = new GenericIdentity(UserId);
        }

        public int user_id { get; set; }
        public string user_nm { get; set; }
        public string full_nm { get; set; }
        public string user_ty { get; set; }
        public bool admin_yn { get; set; }
    }
}
