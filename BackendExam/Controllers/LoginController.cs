using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.Security;
using BackendExamDAL;
using BackendExamModel;

namespace BackendExam.Controllers
{
    public class LoginController : Controller
    {       
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]        
        public JsonResult Login(string username) {
            UserDAL uDAL = new UserDAL();
            User user = uDAL.FindUserByUsername(username.Trim());

            if (user != null)
            {
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                string userData = serializer.Serialize(user);

                FormsAuthenticationTicket authTicket = new FormsAuthenticationTicket(1, user.user_nm, DateTime.Now, DateTime.Now.AddHours(1), true, userData, FormsAuthentication.FormsCookiePath);
                string encTicket = FormsAuthentication.Encrypt(authTicket);
                HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, encTicket);

                cookie.Expires = authTicket.Expiration;
                Response.Cookies.Add(cookie);
                user.loggedin_yn = true;
            }
            else {
                user = new User();
                user.loggedin_yn = false;
                user.remarks_tx = "Cannot find user";
            }

            return Json(user);
        }

        public ActionResult Logout()
        {
            var userDAL = new UserDAL();
            Custom2IPrincipal customUser = User as Custom2IPrincipal;


            FormsAuthentication.SignOut();            
            Session.Clear();
            try
            {
                HttpCookie sessionCokie = HttpContext.Request.Cookies["_CurrentSessionId"];
                if (sessionCokie != null)
                {
                    HttpCookie nCookie = new HttpCookie("_CurrentSessionId");
                    nCookie.Expires = DateTime.Now.AddDays(-1);
                    Response.Cookies.Add(nCookie);
                }
            }
            catch { }
            return RedirectToAction("Index", "Login");
        }

    }
}