import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import express from "express";
import session from "express-session"; // ✅ Importado arriba

interface User {
  id: number;
  email: string;
  firstName: string;
}

// Simulación de usuario para desarrollo
const fakeUser: User = {
  id: 1,
  email: "test@example.com",
  firstName: "Test",
};

// Configurar Local Strategy
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    if (email === "test@example.com" && password === "1234") {
      return done(null, fakeUser);
    }
    return done(null, false, { message: "Invalid credentials" });
  })
);

// Serializar usuario
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: number, done) => {
  done(null, fakeUser); // siempre el fake
});

// Middleware para verificar autenticación
export const isAuthenticated = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Configuración de Passport en Express
export const setupAuth = (app: express.Application) => {
  app.use(
    session({
      secret: "dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // ✅ en dev es false, en producción con HTTPS debe ser true
        sameSite: "lax",
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Ruta de login
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json({ message: "Logged in", user: fakeUser });
  });

  // Ruta de logout
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Error logging out" });
      res.json({ message: "Logged out" });
    });
  });

  // ✅ Nueva ruta: obtener usuario autenticado
  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
};
