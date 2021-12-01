import passport, { Profile } from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GithubStrategy } from "passport-github";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { VerifyCallback } from "passport-oauth2";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repository/user.repository";
import config from "../config";
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
      clientID: config.GITHUB_ID,
      clientSecret: config.GITHUB_SECRET,
      callbackURL: `${config.SERVER_URL}/auth/github/callback`,
      scope: ["read:user"],
    },
    callback
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK_ID,
      clientSecret: config.FACEBOOK_SECRET,
      callbackURL: `${config.SERVER_URL}/auth/facebook/callback`,
      profileFields: ["photos", "id", "displayName"],
    },
    callback
  )
);
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_ID,
      clientSecret: config.GOOGLE_SECRET,
      callbackURL: `${config.SERVER_URL}/auth/google/callback`,
      scope: ["profile"],
    },
    callback
  )
);
export { passport };
