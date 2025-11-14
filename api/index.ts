import app from "../backend/src/index";

export default function handler(req: any, res: any) {
  app(req, res);
}