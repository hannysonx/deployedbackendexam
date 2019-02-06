﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Script.Serialization;
using System.Web.Security;
using BackendExamModel;

namespace BackendExam
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Application_PostAuthenticateRequest(Object sender, EventArgs e)
        {
            HttpCookie authCookie = Request.Cookies[FormsAuthentication.FormsCookieName];

            if (authCookie != null)
            {
                try
                {
                    FormsAuthenticationTicket authTicket = FormsAuthentication.Decrypt(authCookie.Value);

                    JavaScriptSerializer serializer = new JavaScriptSerializer();

                    User serializeModel = serializer.Deserialize<User>(authTicket.UserData);

                    Custom2IPrincipal newUser = new Custom2IPrincipal(authTicket.Name);
                    newUser.user_id = serializeModel.user_id;
                    newUser.user_nm = serializeModel.user_nm;
                    newUser.admin_yn = serializeModel.user_ty == 0;

                    HttpContext.Current.User = newUser;
                }

                catch
                {
                    FormsAuthentication.SignOut();
                }
            }
        }
    }
}
