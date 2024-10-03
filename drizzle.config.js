/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://AI_Mock_owner:DqzLPM2xvwc0@ep-steep-violet-a54mzcse.us-east-2.aws.neon.tech/AI_Mock?sslmode=require',
    }
  };