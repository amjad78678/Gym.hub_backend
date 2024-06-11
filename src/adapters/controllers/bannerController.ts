import BannerUseCase from "../../useCase/bannerUseCase";
import { Request, Response } from "express";

class BannerController {
  private _BannerUseCase: BannerUseCase;
  constructor(bannerUseCase: BannerUseCase) {
    this._BannerUseCase = bannerUseCase;
  }

  async addBanner(req: Request, res: Response) {
    try {
      const banner = await this._BannerUseCase.addBanner(req.body, req.file);
      res.status(banner.status).json(banner.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async fetchBanners(req: Request, res: Response) {
    try {
      const banners = await this._BannerUseCase.fetchBanners();
      res.status(banners.status).json(banners.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async updateBanner(req: Request, res: Response) {
    try {
      const banner = await this._BannerUseCase.updateBanner(req.body, req.file);
      res.status(banner.status).json(banner.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }
}

export default BannerController;
