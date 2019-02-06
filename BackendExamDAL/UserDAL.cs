using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BackendExamModel;
using System.Data.Entity;

namespace BackendExamDAL
{
    public class UserDAL
    {
        DBContext db = null;
        IDbSet<User> _dbset = null;
        public UserDAL() {
            db = new DBContext();
            _dbset = db.User;
        }

        public User FindUser(int userid) {
            return _dbset.Where(a => a.user_id == userid).FirstOrDefault();
        }

        public User FindUserByUsername(string usernm) {
            return _dbset.Where(a => a.user_nm.Trim() == usernm).FirstOrDefault();
        }

        public List<User> GetUsersExceptCurrent(Custom2IPrincipal userLoggedin) {
            return _dbset.Where(a => a.user_id != userLoggedin.user_id && a.active_yn == true).ToList();
        }

        public bool Add(User user, ref Dictionary<string, string> msgs) {
            bool successyn = false;
            validate(user, "add", ref msgs);
            bool hasErroryn = msgs.Count > 0;
            if (!hasErroryn) {
                try
                {
                    db.User.Add(user);
                    db.SaveChanges();
                    successyn = true;
                }
                catch (Exception e)
                {
                    msgs["trycatch"] = e.Message;
                }
            }

            return successyn;
        }

        public bool Edit(User user, ref Dictionary<string, string> msgs)
        {
            bool successyn = false;
            
            validate(user, "edit", ref msgs);
            bool hasErroryn = msgs.Count > 0;
            if (!hasErroryn)
            {
                try
                {
                    User oldUser = FindUser(user.user_id);
                    oldUser.first_nm = user.first_nm;
                    oldUser.last_nm = user.last_nm;
                    oldUser.address_tx = user.address_tx;
                    oldUser.email_ad = user.email_ad;
                    oldUser.phone_nb = user.phone_nb;
                    oldUser.birth_dt = user.birth_dt;
                    oldUser.notes_tx = user.notes_tx;
                    oldUser.user_ty = user.user_ty;
                    db.Entry(oldUser).State = EntityState.Modified;
                    db.SaveChanges();
                    successyn = true;
                }
                catch (Exception e)
                {
                    msgs["trycatch"] = e.Message;
                }
            }

            return successyn;
        }

        public bool Delete(int userid, ref Dictionary<string, string> msgs) {
            bool successyn = false;
            try
            {
                User oldUser = FindUser(userid);
                oldUser.active_yn = false;
                db.Entry(oldUser).State = EntityState.Modified;
                db.SaveChanges();
                successyn = true;
            }
            catch (Exception e)
            {
                msgs["trycatch"] = e.Message;
            }

            return successyn;
        }

        public void validate(User user, string taskcd, ref Dictionary<string, string> msgs) {
            if (taskcd == "add" || taskcd == "edit") {
                if (taskcd == "edit") {
                    bool existingyn = FindUser(user.user_id) != null;
                    if (!existingyn) msgs["user_id"] = "Record does not exist";
                }

                if (String.IsNullOrEmpty(user.user_nm.Trim())) msgs["user_nm"] = "Username is required";
                else {
                    User duplicate = FindUserByUsername(user.user_nm);
                    if(duplicate != null && duplicate.user_id != user.user_id) msgs["user_nm"] = "Duplicate username";
                }

                if (String.IsNullOrEmpty(user.first_nm.Trim())) msgs["first_nm"] = "First Name is required";
                if (String.IsNullOrEmpty(user.last_nm.Trim())) msgs["last_nm"] = "Last Name is required";
                if (String.IsNullOrEmpty(user.phone_nb.Trim())) msgs["phone_nb"] = "Phone No. is required";
                if (String.IsNullOrEmpty(user.email_ad.Trim())) msgs["email_ad"] = "Email is required";
            }
        }
    }
}
