import BannerUseCase from "../../useCase/bannerUseCase";
import { Request, Response } from "express";
import asyncErrorHandler from "../../infrastructure/utils/asyncErrorHandler";

class BannerController {
  private _BannerUseCase: BannerUseCase;

  constructor(bannerUseCase: BannerUseCase) {
    this._BannerUseCase = bannerUseCase;
  }

  addBanner = asyncErrorHandler(async (req: Request, res: Response) => {
    const banner = await this._BannerUseCase.addBanner(req.body, req.file);
    res.status(banner.status).json(banner.data);
  });

  fetchBanners = asyncErrorHandler(async (req: Request, res: Response) => {
    const banners = await this._BannerUseCase.fetchBanners();
    res.status(banners.status).json(banners.data);
  });

  updateBanner = asyncErrorHandler(async (req: Request, res: Response) => {
    const banner = await this._BannerUseCase.updateBanner(req.body, req.file);
    res.status(banner.status).json(banner.data);
  });
}

export default BannerController;
