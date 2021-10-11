import express from "express";
import { FakerService } from "../services/faker";
import { isLoggedIn } from "../../middlewares/auth";

const router = express.Router();
//const publicPath = path.resolve(__dirname, "../../public");

router.get("/", (req, res) => {
  if (req.isAuthenticated) {
    res.redirect("/productos/login");
  } else {
    res.redirect("/productos/vista");
  }
});

router.get("/login", async (req, res) => {
  if (req.isAuthenticated()) res.redirect("/productos/vista");
  else {
    res.render("login");
  }
});

router.get("/login-ok-fb", async (req, res) => {
  let foto = "noPhoto";
  let email = "noEmail";

  if (req.isAuthenticated()) {
    const userData = req.user;
    //reinicio contador
    if (!userData.contador) userData.contador = 0;
    userData.contador++;

    if (userData.photos) foto = userData.photos[0].value;

    if (userData.emails) email = userData.emails[0].value;

    res.render("login-ok-fb", {
      nombre: userData.displayName,
      contador: userData.contador,
      foto,
      email,
    });
  } else {
    res.redirect("/productos/login");
  }
});

router.get("/signup", async (req, res) => {
  res.render("signup");
});

router.get("/error-login", async (req, res) => {
  res.render("error-login");
});

//router.get("/error-signup", async (req, res) => {
//  res.render("error-signup");
//});

//router.get("/ok-signup", async (req, res) => {
//  res.render("ok-signup");
//});

router.get("/logout", (req, res) => {
  req.session.destroy();
  //req.logout();
  res.redirect("/productos/login");
});

router.get("/vista", isLoggedIn, async (req, res) => {
  const userData = req.user;
  userData.contador++;
  const username = userData.displayName;
  res.render("main", { username });
});

router.get("/ingreso", isLoggedIn, async (req, res) => {
  const userData = req.user;
  userData.contador++;
  const username = userData.displayName;
  res.render("ingreso", { username });
});

router.get("/vista-test", (req, res) => {
  const cantidad = req.query.cant ? Number(req.query.cant) : 10;
  const arrayProductos = FakerService.generar(cantidad);

  res.render("vista-test", { arrayProductos: arrayProductos });
});

export default router;
