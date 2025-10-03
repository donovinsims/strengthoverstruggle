import dylannFounderImage from "@/assets/dylann-founder-new.jpg";
import alexFounderImage from "@/assets/alex-founder.jpg";
import vanessaFounderImage from "@/assets/vanessa-founder.jpg";

export interface Founder {
  id: string;
  name: string;
  role: string;
  bio: string;
  fullBio: string;
  instagram: string;
  image: string;
}

export const founders: Founder[] = [
  {
    id: "alex",
    name: "Alex Limberg",
    role: "Founder/President",
    bio: "Detective, Swat Operator, and Fitness Fanatic. Alex Limberg is an athlete and law enforcement officer.",
    fullBio: "Detective, Swat Operator, and Fitness Fanatic. Alex Limberg is an athlete and law enforcement officer. Through personal and professional experiences, Alex understands the impact and need for youth and young-adults to have positive support systems and healthy coping opportunities. He founded SOS to promote physical and mental health in deserving and opportunistic youth.",
    instagram: "https://www.instagram.com/alex__limberg/",
    image: alexFounderImage,
  },
  {
    id: "vanessa",
    name: "Vanessa Tellez",
    role: "Co-Founder/Treasurer",
    bio: "Registered Nurse, athlete, and youth wellness advocate pursuing a Doctorate of Nursing Practice.",
    fullBio: "Vanessa Tellez, a Registered Nurse, athlete, and youth wellness advocate, is an experienced emergency room nurse pursuing a Doctorate of Nursing Practice to become a Nurse Practitioner. With a strong background in clinical care and community service, she emphasizes the vital link between physical health, mental wellness, and accessible support.\n\nFitness has been transformative in Vanessa's life, inspiring her to run local 5Ks and participate in community events that support homeless youth and raise awareness for meaningful causes. Her passion for health extends beyond the hospital, as she works to create opportunities for young people to thrive physically, mentally, and emotionally.",
    instagram: "https://www.instagram.com/vanessa49x/",
    image: vanessaFounderImage,
  },
  {
    id: "dylann",
    name: "Dylann Rauch",
    role: "Co-Founder/Vice President",
    bio: "Prior Professional Athlete, Child Maltreatment investigator, and Community Activist.",
    fullBio: "Prior Professional Athlete, Child Maltreatment investigator, and Community Activist. Dylann Rauch is a prior professional quarterback, barber, and now Child Maltreatment Investigator. Dylann Rauch has multiple years of experience serving underserved youth and partnering with local schools, providing new opportunities for opportunistic youth. These activities include but are not limited to holiday community events, and sports like ice skating, self-defense classes, weight lifting, and football.",
    instagram: "",
    image: dylannFounderImage,
  },
];
