import Banner from "../domain/banner";
import BannerRepository from "../infrastructure/repository/bannerRepository";
import SharpImages from "../infrastructure/services/sharpImages";
import CloudinaryUpload from "../infrastructure/utils/cloudinaryUpload";

class BannerUseCase {
  private _BannerRepository: BannerRepository;
  private _SharpImages: SharpImages;
  private _CloudinaryUpload: CloudinaryUpload;
  constructor(
    bannerRepository: BannerRepository,
    sharpImages: SharpImages,
    cloudinaryUpload: CloudinaryUpload
  ) {
    this._BannerRepository = bannerRepository;
    this._SharpImages = sharpImages;
    this._CloudinaryUpload = cloudinaryUpload;
  }

  async addBanner(data: any, file: any) {
    const image = await this._SharpImages.sharpenImage(
      file,
      1200,
      589,
      "banners"
    );
    const obj = {
      imageUrl: image.secure_url,
      public_id: image.public_id,
    };

    const fullData: Banner = { ...data, bannerImage: obj };
    await this._BannerRepository.addBanner(fullData);
    return {
      status: 200,
      data: {
        success: true,
        message: "Banner added successfully",
      },
    };
  }

  async fetchBanners() {
    const banners = await this._BannerRepository.fetchBanners();
    return {
      status: 200,
      data: {
        success: true,
        banners: banners,
      },
    };
  }

  async updateBanner(data: any, file: any) {
    const { bannerImage, id, ...body } = data;
    const banner = await this._BannerRepository.findById(id);
    
    

    if (file) {
      await this._CloudinaryUpload.deleteImage(banner?.bannerImage.public_id);
      const image = await this._SharpImages.sharpenImage(
        file,
        1200,
        589,
        "banners"
      );
      const obj = {
        imageUrl: image.secure_url,
        public_id: image.public_id,
      };
      const fullData: Banner = { ...body, bannerImage: obj };
      await this._BannerRepository.updateBanner(id, fullData);
    } else {
      const fullData: Banner = { ...body };
      await this._BannerRepository.updateBanner(id, fullData);
    }

    return {
      status: 200,
      data: {
        success: true,
        message: "Banner updated successfully",
      },
    };
  }
}

export default BannerUseCase;
