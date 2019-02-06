using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BackendExamModel;
using BackendExamDAL;

namespace BackendExam.Controllers
{
    public class HomeController : Controller
    {
        UserDAL userDAL = null;
        public HomeController() {
            userDAL = new UserDAL();
        }

        public ActionResult Index()
        {
            Custom2IPrincipal user = User as Custom2IPrincipal;

            if (user == null) {
                return RedirectToAction("Index", "Login");
            }
            List<User> users = userDAL.GetUsersExceptCurrent(user);
            return View(users);
        }

        [HttpGet]
        public ActionResult AddEditClient(string taskcd, int userid = 0) {

            User client = new User();
            if (taskcd == "edit" || taskcd == "view") {
                client = userDAL.FindUser(userid);
            }

            return PartialView("AddEditClient", client);
        }

        [HttpPost]
        public JsonResult AddEditClient(User user)
        {
            Dictionary<string, string> msgs = new Dictionary<string, string>();
            bool successyn = false;
            if (user.user_id == 0) successyn = userDAL.Add(user, ref msgs);
            else successyn = userDAL.Edit(user, ref msgs);
            
            return Json(new { msgs = msgs, successyn = successyn }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteClient(int userid)
        {
            Dictionary<string, string> msgs = new Dictionary<string, string>();
            bool successyn = userDAL.Delete(userid, ref msgs);
            return Json(new { msgs = msgs, successyn = successyn }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}