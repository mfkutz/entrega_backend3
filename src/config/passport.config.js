import passport from "passport";
import jwt from "passport-jwt";
import localStrategy from "passport-local";
import { userService } from "../services/user.service.js";
import { verifyPassword, createHash } from "../utils/hash.functions.js";
import { config } from "./config.js";

const LocalStrategy = localStrategy.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

function initializePassport() {
  //Cookie extractor
  const cookieExtractor = (req, res) => {
    return req && req.cookies ? req.cookies.token : null;
  };

  console.log("see here", config.JWT_SECRET);
  //JWT Strategy
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([ExtractJWT.fromAuthHeaderAsBearerToken(), cookieExtractor]),
        secretOrKey: config.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          const user = await userService.findOne({ email: payload.email }, { password: 0 });
          if (!user) return done({ message: "User not found ", status: 404 });
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  //Login Strategy
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await userService.findOne({ email }, "+password");
          const testDataUser = await userService.findOne({ email });
          if (!user) return done(null, false, { message: "User not found" });
          const isPasswordCorrect = await verifyPassword(password, user.password);
          if (!isPasswordCorrect) return done(null, false, { message: "Incorrect password" });
          return done(null, user);
        } catch (error) {
          return done(`Error:${error.message}`);
        }
      }
    )
  );

  //Register Strategy
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          let { first_name, last_name, age, role } = req.body;

          //Delete spaces in the beginning and end of the string
          //trim in password is not recommended, user may want to use it
          first_name = first_name.trim();
          last_name = last_name.trim();
          email = email.trim();
          age = age.trim();
          role = role.trim();

          if (!first_name || !last_name || !email || !password || !age) {
            return done(null, false, { message: "All fields are required" });
          }
          const userExists = await userService.findOne({ email });

          if (userExists) return done(null, false, { message: "User already exists" });

          const hashPassword = await createHash(password);

          const user = await userService.createUser({
            first_name,
            last_name,
            email,
            age,
            role,
            password: hashPassword,
          });
          return done(null, user);
        } catch (error) {
          return done(null, false, { message: error.message });
        }
      }
    )
  );
}

export { initializePassport };
