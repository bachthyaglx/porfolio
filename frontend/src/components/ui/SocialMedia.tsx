import Image from 'next/image';

function SocialMedia ({size} : {size: number}) {
  return (
    <div className="flex justify-center gap-2 pb-4"  style={{ pointerEvents: 'auto' }}>
      <a className="bg-black bg-opacity-50 p-4 rounded-full transition-all hover:scale-110 scale-100" target="_blank" href="https://www.linkedin.com/in/thykhuu2105/">
        <Image 
          src="/icons/linkedin.svg" 
          alt="Icon" width={size} 
          height={size} 
          loading="lazy"  // Enables lazy loading
          priority={false} // Ensures this image is not eagerly loaded
        />
      </a>
      <a className="bg-black bg-opacity-50 p-4 rounded-full transition-all hover:scale-110 scale-100" target="_blank" href="https://github.com/bachthyaglx">
        <Image 
          src="/icons/github.svg" 
          alt="Icon" width={size} 
          height={size} 
          loading="lazy"  // Enables lazy loading
          priority={false} // Ensures this image is not eagerly loaded
        />
      </a>
      <a className="bg-black bg-opacity-50 p-4 rounded-full transition-all hover:scale-110 scale-100" target="_blank" href="https://bachthyaglx.s3.us-east-1.amazonaws.com/CV_2025_Thy_Khuu.pdf">
        <Image 
          src="/icons/cv.png" 
          alt="Icon" 
          width={size} 
          height={size} 
          loading="lazy"  // Enables lazy loading
          priority={false} // Ensures this image is not eagerly loaded
        />
      </a>
    </div>
  )
}

export default SocialMedia;