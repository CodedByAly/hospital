import restaurant from '../config/restaurant';
import Reveal from './Reveal';
import Icon from './Icon';

/** Posts from @khalifa.bites (images in /public/images/posts, captions from the posts). */
export const POSTS = [
  { file: 'street-99', alt: 'Street 99 burger with melted cheese being poured over it', caption: 'Where every bite melts perfection.' },
  { file: 'smashing-ciabatta', alt: 'Ciabatta sandwich pulled apart with stretching mozzarella', caption: 'Smashing Ciabatta.' },
  { file: 'garlic-parmesan-wings', alt: 'Garlic parmesan wings with a cold drink', caption: 'Garlic lovers, this one’s for you!' },
  { file: 'swiss-n-mushroom', alt: 'Swiss N’ Mushroom burger with fries', caption: 'Creamy, rich & absolutely irresistible.' },
  { file: 'rocky-fish', alt: 'Rocky Fish burger', caption: 'Crispy. Juicy. Irresistible.' },
  { file: 'combo-box', alt: 'Khalifa Bites box with strips, fries, burger and shawarma', caption: 'More than a snack… a complete dining experience.' },
  { file: 'sub-locked-loaded', alt: 'Crispy chicken sub on branded paper', caption: 'Locked, loaded, and ready to be devoured.' },
  { file: 'fast-delivery', alt: 'Shawarma wrap with wheels — fast delivery', caption: 'Fast delivery.' },
];

export default function InstagramGrid({ limit = POSTS.length }) {
  return (
    <ul className="insta-grid">
      {POSTS.slice(0, limit).map((p, i) => (
        <Reveal as="li" key={p.file} delay={(i % 4) * 60}>
          <a href={restaurant.social.instagram} target="_blank" rel="noopener noreferrer" className="insta-post">
            <img src={`/images/posts/${p.file}.webp`} alt={p.alt} loading="lazy" decoding="async" />
            <span className="insta-post__caption">
              <Icon name="instagram" size={18} />
              {p.caption}
            </span>
          </a>
        </Reveal>
      ))}
    </ul>
  );
}
