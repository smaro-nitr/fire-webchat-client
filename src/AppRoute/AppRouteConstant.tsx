import Chat from "page/Chat/ChatComponent";
import Login from "page/Login/LoginComponent";
import NotFound from "feature/NotFound/NotFoundComponent";
import Navbar from "feature/Navbar/NavbarComponent";
import Contact from "page/Contact/ContactComponent";

const pathParamRoute: any[] = [];

export const navbar = [
  {
    path: "/home",
    exact: true,
    sidebar: Navbar,
    main: Chat,
    title: "Chat",
  },
  {
    path: "/contact",
    exact: true,
    sidebar: Navbar,
    main: Contact,
    title: "Contact",
  },
];

export const routes = [
  ...pathParamRoute,
  ...navbar,
  {
    path: "/",
    exact: true,
    sidebar: null,
    main: Login,
    title: "",
  },
  {
    path: "*",
    exact: true,
    sidebar: null,
    main: NotFound,
    title: "Not Found",
  },
];
