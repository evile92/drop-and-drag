import React from 'react';

export interface CardPair {
  id: string;
  question: string;
  answer: string;
  svg: React.ReactNode;
}

export const CLASSROOM_PAIRS: CardPair[] = [
  {
    id: 'marrakech',
    question: 'Dans quelle ville se trouve la place Jemaa el-Fna ?',
    answer: 'Marrakech',
    svg: <img src="/images/marrakech.jpg" className="w-full h-full object-cover" alt="Marrakech" />
  },
  {
    id: 'hassan2',
    question: 'Dans quel pays se trouve la mosquée Hassan II ?',
    answer: 'Maroc',
    svg: <img src="/images/hassan2.jpg" className="w-full h-full object-cover" alt="Mosquée Hassan II" />
  },
  {
    id: 'rabat',
    question: 'Quelle ville est la capitale du Maroc ?',
    answer: 'Rabat',
    svg: <img src="/images/rabat.jpg" className="w-full h-full object-cover" alt="Rabat" />
  },
  {
    id: 'chefchaouen',
    question: 'Dans quelle ville peut-on visiter la médina bleue du Maroc ?',
    answer: 'Chefchaouen',
    svg: <img src="/images/chefchaouen.jpg" className="w-full h-full object-cover" alt="Chefchaouen" />
  },
  {
    id: 'tajine',
    question: 'Dans quel pays est originaire le tajine ?',
    answer: 'Maroc',
    svg: <img src="/images/tajine.jpg" className="w-full h-full object-cover" alt="Tajine" />
  },
  {
    id: 'nouakchott_mosque',
    question: 'Dans quelle ville se trouve la grande mosquée de Nouakchott ?',
    answer: 'Nouakchott',
    svg: <img src="/images/nouakchott_mosque.PNG" className="w-full h-full object-cover" alt="Mosquée Nouakchott" />
  },
  {
    id: 'banc_arguin',
    question: "Dans quel pays se trouve le parc national du Banc d'Arguin ?",
    answer: 'Mauritanie',
    svg: <img src="/images/banc_arguin.jpg" className="w-full h-full object-cover" alt="Banc d'Arguin" />
  },
  {
    id: 'capitale_mauritanie',
    question: 'Quelle ville est la capitale de la Mauritanie ?',
    answer: 'Nouakchott',
    svg: <img src="/images/capitale_mauritanie.PNG" className="w-full h-full object-cover" alt="Nouakchott Mauritanie" />
  },
  {
    id: 'chinguetti',
    question: "Dans quelle ville peut-on visiter l'ancienne cité de Chinguetti ?",
    answer: 'Chinguetti',
    svg: <img src="/images/chinguetti.jpg" className="w-full h-full object-cover" alt="Chinguetti" />
  },
  {
    id: 'mechoui',
    question: 'Dans quel pays est originaire le méchoui mauritanien ?',
    answer: 'Mauritanie',
    svg: <img src="/images/mechoui.PNG" className="w-full h-full object-cover" alt="Méchoui" />
  }
];
