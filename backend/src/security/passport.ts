import passport, { Profile } from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GithubStrategy } from "passport-github";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { VerifyCallback } from "passport-oauth2";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repository/user.repository";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "root",
    },
    async (payload, done) => {
      try {
        const user = await getCustomRepository(UserRepository).findAuthUser(
          payload.id
        );
        if (user) {
          return done(null, user);
        }
        done(null, false);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
function callback(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) {
  getCustomRepository(UserRepository)
    .authenticateUser(profile)
    .then((user) => {
      if (user) {
        return done(null, user);
      }
      done(new Error(), false);
    })
    .catch((err) => done(err, false));
}
passport.use(
  new GithubStrategy(
    {
      clientID: "Iv1.08f50a3a50ab3134",
      clientSecret: "b7d2b46d31c9d4a66c61e96f8b6d196128892891",
      callbackURL: "http://localhost:8080/auth/github/callback",
      scope: ["read:user"],
    },
    callback
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: "155615789828353",
      clientSecret: "7ae7ff35ae52a1827a673ee6055d0ed0",
      callbackURL: "http://localhost:8080/auth/facebook/callback",
      profileFields: ["photos", "id", "displayName"],
    },
    callback
  )
);
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "150057643993-sh0u3t3d9jgfu3c7vagako9degsbrc9s.apps.googleusercontent.com",
      clientSecret: "cew2fwwrvX78Wmz4HZSgIItk",
      callbackURL: "http://localhost:8080/auth/google/callback",
      scope: ["profile"],
    },
    callback
  )
);
export { passport };
