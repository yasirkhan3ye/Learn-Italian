
import { VocabularyPack } from './types';

export const VOCABULARY_PACKS: VocabularyPack[] = [
  {
    id: 'kitchen',
    title: 'Il Mio Cucina',
    subtitle: 'Kitchen Items',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArrqGb7ZOO3kG_mURTaSGAf95ncKqX3xNdu3WCVU5lh512s7yJkI236dHSA5ZySp3L0Exjp7EB3t52Im1SRRmBTwizbQBrzOoSLjsLzTyO-Hcem23Bq0SHFEQ-A25CXdhqqFrteBeQhAcZiQySGBFfe4ecr1VPfiVPl1hf32HhicuJF5wwVEDs35CJPBPxTu76tqIekyQd3Wni3wSB5yxiqRJQdO8iYLtgk4O74tjmKmAFxoepa5smSPH5mqRmwHyv6zpyq8ktL0M',
    icon: 'countertops',
    items: [
      { italian: 'Il tavolo', english: 'The table', urdu: 'میز' },
      { italian: 'La sedia', english: 'The chair', urdu: 'کرسی' },
      { italian: 'Il forno', english: 'The oven', urdu: 'اوون' },
      { italian: 'Il frigorifero', english: 'The refrigerator', urdu: 'فریج' },
      { italian: 'Il coltello', english: 'The knife', urdu: 'چاقو' },
      { italian: 'La forchetta', english: 'The fork', urdu: 'کانٹا' },
      { italian: 'Il cucchiaio', english: 'The spoon', urdu: 'چمچ' },
      { italian: 'La tazza', english: 'The cup', urdu: 'پیالی' }
    ]
  },
  {
    id: 'bathroom',
    title: 'Bagno',
    subtitle: 'Bathroom',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyZ4GkOMkq6coSa423EpgsKByi0gJnzu1t1Q2Am2BbNLIbG46fS0dmmB3aNLJ4ZmkCB6_5C_MCIS9-h3g4U0U72zl0JJBzF_XZIUpW5Z50EcplXLlNqgEA7rF3bWfryA2EfSLCflN_tYBSe2Jjep5biT8bMZZNksEN_h1qvhjLFsI2nLrS8r__-5I2suay4hpqn3p_YZLLqksm7XC6JDWicYiQ3oU5xZVJLp5qM4atdJwFR4t2KF10h9omANFGRTzvdIjndTAGtnA',
    icon: 'bathroom',
    items: [
      { italian: 'La doccia', english: 'The shower', urdu: 'شاور' },
      { italian: 'Lo specchio', english: 'The mirror', urdu: 'آئینہ' },
      { italian: 'Il sapone', english: 'The soap', urdu: 'صابن' },
      { italian: 'L\'asciugamano', english: 'The towel', urdu: 'تولیہ' },
      { italian: 'Lo spazzolino', english: 'The toothbrush', urdu: 'ٹوتھ برش' },
      { italian: 'Il dentifricio', english: 'The toothpaste', urdu: 'ٹوتھ پیسٹ' }
    ]
  },
  {
    id: 'vegetables',
    title: 'Verdura',
    subtitle: 'Vegetables',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9dKMdFq7ZMzzDTm3yURkjAoc9F53cQ6Vs2FkuK2Y5c8MBqXOpj7bU-ogQKezZ82lDseyzX8nZM1doBnVnOUDwRFiTzLuO4mw_ZE7Dff46mOpTKcL42IqR1yVL6LCUsp4Dxp7a8IOtpcQtUBQEXRnVnYPrU9yz-iqdqrHuZU1zi5qA01TQUWdXEYZzUsZL3fBIuig21ajlRVbdXPWLEcFsblcJZHwYE-0TS68rHWYJ8Wpl8QqXtp6qB_fgj7xhUIPWz7qgXIJ4PBc',
    icon: 'nutrition',
    items: [
      { italian: 'La carota', english: 'The carrot', urdu: 'گاجر' },
      { italian: 'Il pomodoro', english: 'The tomato', urdu: 'ٹماٹر' },
      { italian: 'La patata', english: 'The potato', urdu: 'آلو' },
      { italian: 'La cipolla', english: 'The onion', urdu: 'پیاز' },
      { italian: 'Il cetriolo', english: 'The cucumber', urdu: 'کھیرا' },
      { italian: 'I broccoli', english: 'The broccoli', urdu: 'بروکولی' },
      { italian: 'L\'insalata', english: 'The salad', urdu: 'سلاد' }
    ]
  },
  {
    id: 'fruits',
    title: 'Frutta',
    subtitle: 'Fruits',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDv_6sN7q_PEmUxaJPLARiAcDhH4mz--9NNRKIAS8WHAzUf39ywTOoH5gvPIs-q0leIyDGukk38aMmohzT3A5Ye7ddBW5Wu_R-UUFlJFIHSOnAOz3kQhfNajetOuC1fBwHKKfoSPtBDtjt_ef3eSm6KXY2GDLxldEBzsHOO37WjayXLcmbHuCAmSblihafMxrO-JIu8OZzNHHI-fb2xBRe60tTE7zGXQ6SO43KN_xscHT_58KN0x8YjJpypaeurgg33OfkPFr7Shb4',
    icon: 'eco',
    items: [
      { italian: 'La mela', english: 'The apple', urdu: 'سیب' },
      { italian: 'La banana', english: 'The banana', urdu: 'کیلا' },
      { italian: 'L\'arancia', english: 'The orange', urdu: 'مالٹا' },
      { italian: 'La fragola', english: 'The strawberry', urdu: 'سٹرابیری' },
      { italian: 'L\'uva', english: 'The grapes', urdu: 'انگور' },
      { italian: 'Il limone', english: 'The lemon', urdu: 'لیموں' }
    ]
  }
];

export const CONVERSATION_PACK = {
  title: 'Conversazione',
  subtitle: 'Basic Conversation Phrases',
  imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop',
  icon: 'forum'
};

export const USER_IMAGE = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop';
