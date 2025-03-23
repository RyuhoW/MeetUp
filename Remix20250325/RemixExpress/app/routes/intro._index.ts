export default function Intro() {

  enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
  }


  interface Intro {
    Name: string;
    Position: string;
    Profile: string;
    Age: undefined;
    Gender: Gender | null;
  }

  const MySelft: Intro = {
    Name: "渡邊 龍鵬",
    Position: "エンジニア",
    Profile: "フルスタック業務、広告運用、マーケティング",
    Age: undefined,
    Gender: null
  };

  return MySelft;

}
