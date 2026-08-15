import { Link } from 'react-router-dom'
import { CHAPTERS } from '@data/chapters/chapters.ts'
import styles from './DevMenu.module.css'

export function DevMenu() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Atlas Pluriversal — Dev Menu</h1>
      <p className={styles.subtitle}>31 mapas · 4 capítulos</p>

      {CHAPTERS.map((chapter) => (
        <section key={chapter.id} className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            Capítulo {chapter.id}: {chapter.description}
          </h2>
          <div className={styles.grid}>
            {chapter.maps.map((map) => (
              <Link
                key={map.mapId}
                to={`/test/${map.mapId}`}
                className={styles.card}
              >
                <span className={styles.mapId}>{map.mapId}</span>
                <span className={styles.mapTitle}>{map.title}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
