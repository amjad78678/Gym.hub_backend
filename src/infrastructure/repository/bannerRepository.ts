import BannerModel from "../db/bannerModel";
import Banner from "../../domain/banner";

class BannerRepository {
  
    async addBanner(data: Banner ): Promise<{}>{
        
        const banner = await BannerModel.create(data);
        return banner
    }

    async fetchBanners(): Promise<Banner[] | any> {
        const banners = await BannerModel.find();
        return banners
    }

    async findById(id: string): Promise<any> {
        const banner = await BannerModel.findById(id);
        return banner
    }

    async updateBanner(id: string, data: any): Promise<any> {
        const banner = await BannerModel.findByIdAndUpdate(id, data);
        return banner
    }
}

export default BannerRepository;