// 이미지 배열을 정의하는 파일 (예: images.ts)
import constructingImg from "../assets/constructing.png";
import cookingImg from "../assets/cooking.png";
import familyTimeImg from "../assets/family-time.png";
import playingGuitarImg from "../assets/playing-guitar.png";
import romanticWalkImg from "../assets/romantic-walk.png";
import workingOnComputerImg from "../assets/working-on-computer.png";
import workingOutImg from "../assets/working-out.png";

export interface ImageData {
  src: string;
  alt: string;
}

const images: ImageData[] = [
  { src: constructingImg, alt: "Person working on some furniture." },
  { src: cookingImg, alt: "Person cooking a meal." },
  { src: familyTimeImg, alt: "Family spending time together." },
  { src: playingGuitarImg, alt: "Person playing the guitar." },
  { src: romanticWalkImg, alt: "Couple walking together in the moonshine." },
  { src: workingOnComputerImg, alt: "Person doing work on a computer." },
  { src: workingOutImg, alt: "Person working out." },
];

export default images;
