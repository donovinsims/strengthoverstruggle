import markhiThompsonImage from "@/assets/markhi-thompson.png";
import elenaHenryImage from "@/assets/elena-henry.png";
import ivanHernandezImage from "@/assets/ivan-hernandez.png";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  fullQuote: string;
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "ivan",
    name: "Ivan Hernandez",
    role: "NCAA Powerlifter - Greenville University, 2025 graduate and gym membership recipient Beloit Fresh Start",
    quote: "Through the Beloit Fresh Start program, I connected with Detective Limberg and many other awesome officers. The program taught me responsibility, accountability and collaboration...",
    fullQuote: "Through the Beloit Fresh Start program, I connected with Detective Limberg and many other awesome officers. The program taught me responsibility, accountability and collaboration through the fun task and events we had with these officers.\n\nWhen it came to my down time, I found comfort in the gym and sports. Growing up I was inside a lot as I was bullied for being a bigger kid. I picked up a football when I was 9 and the rest turned into history because I excelled as an athlete and did everything I could to make myself better, so I started lifting.\n\nThe gym is like an escape from reality for me. I fall into depressive states here and there to the point where I just feel like laying in bed and throwing my day away. The gym has helped me pushed through those times and my new passion of powerlifting.\n\nI was blessed to receive a free membership from the help of Detective Limberg and the kind souls at ICONIQ. The local YMCA was my original stomping grounds when I first started lifting and that's when I found out what powerlifting was, so it was nostalgic and fun to be able to go back.\n\nUltimately, the gym is truly a treasure for those who want to better themselves. Many of us young adults and youth need more outlets for our anger, fear, and frustration as society bombards us from all directions. If it weren't for the gym then there's no telling what events could have led me to be a top Collegiate Powerlifter in the nation.",
    image: ivanHernandezImage,
  },
  {
    id: "markhi",
    name: "Markhi Thompson",
    role: "2024 Class President and Gym Membership Recipient, Beloit Fresh Start",
    quote: "I would say it made a big impact in all areas of students' lives. I was seeing kids I never had seen outside of school at the gym, allowing students to bond more and get work in at the same time...",
    fullQuote: "I would say it made a big impact in all areas of students' lives. I was seeing kids I never had seen outside of school at the gym, allowing students to bond more and get work in at the same time. I personally was doing boxing and in the gym prior to receiving the donated memberships but found that it can get expensive… very expensive.\n\nIt would be amazing if this could be an ongoing thing for all kids in Beloit instead of just Beloit Fresh Start students. It would make a big impact. I've seen it personally, and I think it will motivate the youth to take care of themselves and build themselves.\n\nThe gym teaches discipline, character, consistency, confidence, and many more things. That was one of the best experiences I had with boxing, teaching kids combat the right way and how to keep themselves safe.\n\nIt's not just a free membership it's a new way of living and meeting new people with the same mindset. …",
    image: markhiThompsonImage,
  },
  {
    id: "elena",
    name: "Elena Henry",
    role: "Youth Development Program Manager, Beloit Fresh Start",
    quote: "As an educator, I've seen how Alex Limberg and Dylann Rauch's nonprofit gym memberships transformed my students. About 60 joined over the last couple years and loved the safe, structured space...",
    fullQuote: "As an educator, I've seen how Alex Limberg and Dylann Rauch's nonprofit gym memberships transformed my students. About 60 joined over the last couple years and loved the safe, structured space to exercise, relieve stress, and build confidence.\n\nFor many, it was their first gym experience—opening their eyes to healthy routines. This program fills a crucial gap for students without resources or support and deserves strong backing for youth health and community engagement.",
    image: elenaHenryImage,
  },
];
