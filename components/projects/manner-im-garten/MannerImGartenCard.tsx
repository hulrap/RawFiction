import React from 'react';
import Image from 'next/image';
import { ContentWrapper } from './Wrapper';
import type { ProjectProps, TabItem } from '../../shared/types';

// Interface for event data structure
interface MannerImGartenEvent {
  id: string;
  title: string;
  eventTitle: string;
  description: string;
  motto?: string;
  date: string;
  time: string;
  location: string;
  music?: string;
  partner?: string;
  partners?: string[];
  additionalInfo?: string;
  specialNote?: string;
  coverImage: string;
}

// Parse event data from the text descriptions
const parseEventData = () => {
  const events = [
    {
      id: 'mig1',
      title: 'MIG 1',
      eventTitle: 'SEASON OPENING',
      description:
        "Lasst die Männer in den Garten, denn wir wollen nicht mehr warten. Endlich wieder raus an die frische Club Luft! Wien's einzige Queere Garten Party feiert ihr großes Season Opening und ihr dürft nicht fehlen.",
      motto: 'SPRING AIR & POPPING BOTTLES',
      date: 'Samstag, 30. April 2022',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!\n➳ DJ Alessandro Caruso\n➳ Mart.i',
      partner: 'THOMAS HENRY',
      coverImage: '/projects/maenner-im-garten/cover-images/(22).jpg', // Reversed mapping
    },
    {
      id: 'mir1',
      title: 'MIR 1',
      eventTitle: 'REOPENING',
      description:
        'Nach 2 langen Jahren öffnen die Rote Bar und das Volkstheater endlich wieder ihre frisch renovierten Pforten. Klar, dass wir die ersten sind, die hier abfeiern wollen.\nUm die kalte Saison abzuschließen, versammeln sich die Männer im Rotlicht zum REOPENING der Roten Bar und holen erleichtert, fröhlich und wild das Feiern der letzten 2 Jahre nach.\nRED IS BACK.\nYou are invited!',
      date: 'Samstag, 07. Mai 2022',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'ROTE BAR - Volkstheater, Neustiftgasse 1, 1070 - Wien',
      music: 'Pop, Hits, Charts – everything you need!',
      coverImage: '/projects/maenner-im-garten/cover-images/(21).jpg',
    },
    {
      id: 'mig2',
      title: 'MIG 2',
      eventTitle: 'Männer im Garten',
      description:
        "Die Sommervibes versprühen Fröhlichkeit und die Männer*innen wollen wieder in den Garten. Wien's einzige queere Garten-Party geht diese Saison in die zweite Runde im Pavillon.",
      motto: 'HOT & AIR',
      date: 'Samstag, 4. Juni 2022',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!\nOn the decks:\nDJ Julien Charest',
      coverImage: '/projects/maenner-im-garten/cover-images/(20).jpg',
    },
    {
      id: 'mig3',
      title: 'MIG 3',
      eventTitle: 'Männer im Garten',
      description:
        "Die Sommervibes versprühen Fröhlichkeit und die Männer*innen wollen wieder in den Garten. Wien's einzige queere Garten-Party geht diese Saison in die dritte Runde im Pavillon.",
      motto: 'HOT & AIR',
      date: 'Samstag, 2. Juli 2022',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Chrisleebear (Berlin)\nPop, Hits, Charts – everything you need!',
      coverImage: '/projects/maenner-im-garten/cover-images/(19).jpg',
    },
    {
      id: 'mig4',
      title: 'MIG 4',
      eventTitle: 'Männer im Garten',
      description:
        "Der Hochsommer ist zurück und die Männer*innen sehnen sich nach kühlen Drinks im Garten. Wien's einzige queere Garten-Party geht diese Saison bereits in die vierte Runde im Pavillon und du darfst nicht fehlen!",
      additionalInfo: 'Offizielle Aftershowparty für Vienna Beach Trophy 2022',
      date: 'Samstag, 6. August 2022',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'DJ Chrisleebear (BERLIN)\nPop, Hits, Charts – everything you need!',
      coverImage: '/projects/maenner-im-garten/cover-images/(18).jpg',
    },
    {
      id: 'mig5',
      title: 'MIG 5',
      eventTitle: 'SEASON CLOSING',
      description:
        'Der Sommer neigt sich dem Ende zu. Also versammeln sich die Männer*innen ein letztes Mal im Garten für diese Saison um mit einer ekstatischen Nacht die Rückkehr in die Herbststube einzuleiten.',
      date: 'Samstag, 3. September 2022',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!',
      coverImage: '/projects/maenner-im-garten/cover-images/(17).jpg',
    },
    {
      id: 'mir2',
      title: 'MIR 2',
      eventTitle: 'THE ZOMBIE BOYS',
      description:
        'Die Straßen sind gefüllt mit bunten und niedlichen Faschingskostümen, doch in unserer Höhle warten gefährlich gutaussehende Boys auf ihre nächsten Opfer. Lass dich in eine Welt aus "Scare to Impress" entführen und komme vielleicht nie wieder heim!',
      date: 'Montag, 31. Oktober 2022',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Aux Gazelles, Rahlgasse 5, 1060 Wien',
      music: 'Pop, Hits, Charts – everything you need!',
      coverImage: '/projects/maenner-im-garten/cover-images/(16).jpg',
    },
    {
      id: 'mir3',
      title: 'MIR 3',
      eventTitle: 'Mariah Carey X-Mas Special',
      description:
        'Passend um den Auftakt der Weihnachtszeit einzuleiten, versammeln sich die Männer*innen diesmal wieder in unserer warmen Stube mit einem ganz besonderen Weihnachtsevent. Die Winternächte sind länger und das kosten wir aus.\nMänner im Rotlicht, OMG und Sindicate präsentieren:',
      date: 'Samstag, 19. November 2022',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Aux Gazelles, Rahlgasse 5, 1060 Wien',
      music: 'Pop, Hits, Charts – everything you need!',
      partner: 'Stolichnaya',
      coverImage: '/projects/maenner-im-garten/cover-images/(15).jpg',
    },
    {
      id: 'mig6',
      title: 'MIG 6',
      eventTitle: 'SEASON OPENING',
      description:
        'Nach einer langen Winterpause ohne Männer im Rotlicht Events starten die Männer endlich wieder mit voller Gartenpower in die Nacht! Komm vorbei und feier mit uns den Auftakt zu flüssigen Sommernächten!',
      date: 'Samstag, 06. Mai 2023',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!\n➳ DJ Julien Charest',
      partner: 'THOMAS HENRY',
      coverImage: '/projects/maenner-im-garten/cover-images/(14).jpg',
    },
    {
      id: 'mig-p',
      title: 'MIG P',
      eventTitle: 'PRIDE TRUCK',
      description:
        'STOLI und KRONEHIT haben es uns ermöglicht, dieses Jahr wieder mit unserem Männer im Garten Truck auf der Parade präsent zu sein und ein Zeichen für eine offene und bunte Welt zu setzen!\nAnschließend geht es bei unserer Afterparty im Pavillon weiter ab 22 Uhr.',
      specialNote:
        'Inspiriert von aktuellen Ereignissen, machen wir mit unserem Sujet (David-Statue) auf Zensurversuche aufmerksam, die unsere Freiheit und unser Selbstverständnis bedrohen.',
      date: 'Samstag, 17. Juni 2023',
      time: '13:00 - 18:00',
      location: 'Start: Rathausplatz, Route: Wiener Ring',
      partners: ['Stoli', 'Kronehit', 'Faschingsprinz'],
      coverImage: '/projects/maenner-im-garten/cover-images/(13).jpg',
    },
    {
      id: 'mig7',
      title: 'MIG 7',
      eventTitle: 'PRIDE AFTERPARTY',
      description:
        'Nach unserem Männer im Garten Truck auf der Regenbogenparade freuen wir uns darauf, euch im Pavillon empfangen zu dürfen. Gemeinsam tanzen wir bunt bis in die Nacht und feiern Solidarität, Zusammenhalt und Akzeptanz.',
      date: 'Samstag, 17. Juni 2023',
      time: '22:00 - 05:00',
      location: 'Volksgarten Pavillon',
      partners: ['Almdudler', 'Stoli', 'Faschingsprinz'],
      coverImage: '/projects/maenner-im-garten/cover-images/(12).jpg',
    },
    {
      id: 'mig8',
      title: 'MIG 8',
      eventTitle: 'MÄNNER IM GARTEN',
      description:
        'Die Pride Parade ist vorüber und Pride Month endet leider überall mit 30. Juni. Nicht bei uns! Wir feiern eine bunte und queere Welt jeden Monat aufs Neue. Am 1. Juli treffen sich die Männer*innen wieder im Garten für kühle Drinks und eine warme Sommernacht.',
      date: 'Samstag, 01. Juli 2023',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!',
      partner: 'THOMAS HENRY',
      coverImage: '/projects/maenner-im-garten/cover-images/(11).jpg',
    },
    {
      id: 'mig9',
      title: 'MIG 9',
      eventTitle: 'MÄNNER IM GARTEN',
      description:
        'Der Hochsommer ist da und wir genießen ihn mit euch bei einer neuen Edition von Männer im Garten. Kühle Drinks und die besten Pop-Tunes der Stadt erwarten euch wieder in unserer Outdoor-Indoor Hybrid Stammlocation.',
      date: 'Samstag, 05. August 2023',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!\nDJ Chrisleebear (BERLIN)',
      partners: ['THOMAS HENRY', 'SPORTVEREIN AUFSCHLAG'],
      additionalInfo: 'Vienna Beach Trophy 2023',
      coverImage: '/projects/maenner-im-garten/cover-images/(10).jpg',
    },
    {
      id: 'mig10',
      title: 'MIG 10',
      eventTitle: 'MÄNNER IM GARTEN',
      description:
        'Nachdem es bei unserem letzten Event etwas regnerisch war, haben wir noch eine zweite Männer im Garten Edition im August für euch organisiert. Der nächste Tag ist ein Feiertag und es werden 36 Grad prognostiziert. Perfekt für eine warme Sommernacht im Garten.',
      date: 'Montag, 14. August 2023',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!',
      partner: 'THOMAS HENRY',
      coverImage: '/projects/maenner-im-garten/cover-images/(9).jpg',
    },
    {
      id: 'mig11',
      title: 'MIG 11',
      eventTitle: 'SEASON CLOSING',
      description:
        'Mit schwerem Herzen verabschieden wir uns vom Sommer. Mit einer letzten Männer im Garten Party für die Saison, lassen wir mit Stil die Sau raus. Wir freuen uns auf alle bekannten und neuen Gesichter, die mit uns immer wieder aufs Neue unvergessliche Abende erschaffen.',
      date: 'Samstag, 2. September 2023',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!',
      partner: 'THOMAS HENRY',
      coverImage: '/projects/maenner-im-garten/cover-images/(8).jpg',
    },
    {
      id: 'mig12',
      title: 'MIG 12',
      eventTitle: 'SEASON OPENING',
      description:
        'Nach einer erneuten ausgedehnten Winterpause, in der die traditionellen "Männer im Rotlicht"-Events pausieren mussten, laden wir nun endlich wieder zur jährlichen Gartenparty im Pavillon ein! Komm vorbei und stoß mit uns auf den Auftakt einer unvergesslichen Saison mit warmen Sommernächten an!',
      date: 'Samstag, 04. Mai 2024',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!\nDJ Julien Charest',
      partner: 'THOMAS HENRY',
      coverImage: '/projects/maenner-im-garten/cover-images/(7).jpg',
    },
    {
      id: 'mig13',
      title: 'MIG 13',
      eventTitle: 'PRIDE AFTERPARTY',
      description:
        'Die Pride Parade geht am 8. Juni nach sehnlichem Warten endlich wieder los und wir feiern mit unserer Afterparty Edition LOVE, frei von Vorurteilen und ohne Grenzen.',
      date: 'Samstag, 08. Juni 2024',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!',
      partner: 'STOLI',
      coverImage: '/projects/maenner-im-garten/cover-images/(6).jpg',
    },
    {
      id: 'mig14',
      title: 'MIG 14',
      eventTitle: 'MÄNNER IM GARTEN',
      description:
        'Die nächste Edition steht an und die Männer*innen versammeln sich wieder für die angesagteste Gartenparty der Stadt. Mit kühlen Drinks und den hippsten Pop-Tunes tanzen wir wieder gemeinsam in die lauen Nächte hinein!',
      date: 'Samstag, 06. Juli 2024',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!\nDJ Julien Charest',
      partner: 'THOMAS HENRY',
      coverImage: '/projects/maenner-im-garten/cover-images/(5).jpg',
    },
    {
      id: 'mig15',
      title: 'MIG 15',
      eventTitle: 'MÄNNER IM GARTEN',
      description:
        'Der Hochsommer ist da und wir genießen ihn mit euch, bei der vierten Ausgabe von Männer im Garten. Kühle Drinks und die besten Pop-Tunes der Stadt erwarten euch wieder in unserer Outdoor-Indoor Hybrid Stammlocation.',
      date: 'Samstag, 03. August 2024',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!\n- DJ Julien Charest',
      partner: 'THOMAS HENRY',
      coverImage: '/projects/maenner-im-garten/cover-images/(4).jpg',
    },
    {
      id: 'mig16',
      title: 'MIG 16',
      eventTitle: 'SEASON CLOSING',
      description:
        'Der Sommer geht traurigerweise bald zu Ende und die Männer*innen verabschieden sich von der Saison, so als könnten sie jetzt ein halbes Jahr nicht mehr zur Männer im Garten Party kommen: intensiv, flüssig und mit ekstatischer Energy.',
      date: 'Samstag, 07. September 2024',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!\nDJ Julien Charest',
      partner: 'THOMAS HENRY',
      coverImage: '/projects/maenner-im-garten/cover-images/(3).jpg',
    },
    {
      id: 'mig17',
      title: 'MIG 17',
      eventTitle: 'REOPENING',
      description:
        'WIR SIND ENDLICH ZURÜCK!\nNach einer ausbleibenden Wintersaison letztes Jahr, freuen wir uns besonders, euch für heuer die nächste Edition von Männer im Rotlicht präsentieren zu dürfen!\nAm 8. November feiern wir unser großes Comeback im besonderen Flair der Roten Bar im Volkstheater, mit den hippsten Outfits, poppigen Tunes und der besten Community!',
      specialNote:
        'Achtung! Diesmal ist der Einlass strikt limitiert und VVK-Tickets sind nur auf First Come First Serve Basis erhältlich, solange der Vorrat reicht.',
      date: 'Freitag, 08. November 2024',
      time: '23.00 Uhr - 4.00 Uhr',
      location: 'Rote Bar, Volkstheater, Wien',
      music: 'DJ: FLUAL\nPop, Hits, Charts – everything you need!',
      partner: 'STOLI',
      coverImage: '/projects/maenner-im-garten/cover-images/(2).jpg',
    },
    {
      id: 'mig18',
      title: 'MIG 18',
      eventTitle: 'LOVE WILL TRIUMPH',
      description:
        'Dieses Jahr widmen wir unser Season Opening einem ganz besonderen Thema. Zu den aktuellen Entwicklungen in der Welt haben die Männer*innen im Garten eine ganz klare Botschaft:\nLOVE WILL TRIUMPH!\nJe mehr andere spalten, Differenzen hervorheben, und Negativität versprühen, desto LAUTER, BUNTER und FRÖHLICHER werden wir gemeinsam feiern.',
      date: 'Samstag, 03. Mai 2025',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!',
      partner: 'THOMAS HENRY',
      coverImage: '/projects/maenner-im-garten/cover-images/(1).jpg',
    },
    {
      id: 'mig19',
      title: 'MIG 19',
      eventTitle: 'LOVE WILL TRIUMPH',
      description:
        'Dieses Jahr widmen wir unser Season Opening einem ganz besonderen Thema. Zu den aktuellen Entwicklungen in der Welt haben die Männer*innen im Garten eine ganz klare Botschaft:\nLOVE WILL TRIUMPH!\nJe mehr andere spalten, Differenzen hervorheben, und Negativität versprühen, desto LAUTER und FRÖHLICHER werden wir gemeinsam feiern und die bunte Heiterkeit der Regenbogenparade bis in die Morgenstunden mitnehmen.',
      date: 'Samstag, 14. Juni 2025',
      time: '22.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!',
      partner: 'STOLI',
      coverImage: '/projects/maenner-im-garten/cover-images/(1).jpg', // Note: Using same image as MIG18 since we only have 22 cover images
    },
    {
      id: 'mig20',
      title: 'MIG 20',
      eventTitle: 'LOVE WILL TRIUMPH',
      description:
        'Dieses Jahr widmen wir unsere Reihe einem ganz besonderen Thema. Zu den aktuellen Entwicklungen in der Welt haben die Männer*innen im Garten eine ganz klare Botschaft:\nLOVE WILL TRIUMPH!\nWir sind die Party für alle Gay, Lesbian, Queer, Trans, Non-Binary, Gender-Fluid sowie Drags, Bi-Boys and Bi-Girls, Straight Allies und alle, die es noch werden wollen.',
      date: 'Samstag, 5. Juli 2025',
      time: '23.00 Uhr - 5.00 Uhr',
      location: 'Volksgarten Pavillon, Wien',
      music: 'Pop, Hits, Charts – everything you need!',
      partner: 'STOLI',
      coverImage: '/projects/maenner-im-garten/cover-images/(1).jpg', // Note: Using same image as MIG18 since we only have 22 cover images
    },
  ];

  return events;
};

const EventContent: React.FC<{ event: MannerImGartenEvent }> = ({ event }) => (
  <div className="h-full overflow-y-auto">
    <div className="p-6 space-y-6">
      {/* Event Cover Image */}
      <div className="w-full">
        <Image
          src={event.coverImage}
          alt={`${event.eventTitle} Cover`}
          width={800}
          height={600}
          className="w-full h-auto object-cover rounded-lg"
          priority
        />
      </div>

      {/* Event Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">{event.eventTitle}</h2>
        <div className="text-lg text-brand-accent font-semibold mb-4">{event.title}</div>
        {event.date && event.time && event.location && (
          <div className="text-sm opacity-75 mb-4 space-y-1">
            <div>{event.date}</div>
            <div>{event.time}</div>
            <div>{event.location}</div>
          </div>
        )}
      </div>

      {/* Main Description - Always full width */}
      <div className="card-glass p-6 col-span-full flex flex-col items-center justify-center text-center">
        <p className="text-sm opacity-90 leading-relaxed whitespace-pre-line">
          {event.description}
        </p>
      </div>

      {/* Dynamic Grid Layout for smaller cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Community Statement */}
        <div className="card-glass p-5 flex flex-col items-center justify-center text-center">
          <p className="text-sm opacity-90 leading-relaxed">
            Wir sind die Party für alle Gay, Lesbian, Queer, Trans, Non-Binary, Gender-Fluid sowie
            Drags, Bi-Boys and Bi-Girls, Straight Allies und alle, die es noch werden wollen.
          </p>
        </div>

        {/* Music */}
        {event.music && (
          <div className="card-glass p-5 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-brand-accent mb-3">Music</h3>
            <div className="text-sm opacity-90 leading-relaxed whitespace-pre-line">
              {event.music}
            </div>
          </div>
        )}

        {/* Motto */}
        {event.motto && (
          <div className="card-glass p-5 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-brand-accent mb-3">Motto</h3>
            <p className="text-xl font-bold text-white">{event.motto}</p>
          </div>
        )}

        {/* Partners */}
        {(event.partner || event.partners) && (
          <div className="card-glass p-5 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-brand-accent mb-3">
              {event.partners ? 'Partners' : 'Partner'}
            </h3>
            <div>
              {event.partners ? (
                <div className="space-y-2">
                  {event.partners.map((partner: string, index: number) => (
                    <div key={index} className="text-sm opacity-90">
                      △ {partner}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm opacity-90">{event.partner}</div>
              )}
            </div>
          </div>
        )}

        {/* Additional Info */}
        {event.additionalInfo && (
          <div className="card-glass p-5 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-brand-accent mb-3">Additional Info</h3>
            <p className="text-sm opacity-90 leading-relaxed">{event.additionalInfo}</p>
          </div>
        )}

        {/* Safety Info */}
        <div className="card-glass p-5 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold text-brand-accent mb-3">Info</h3>
          <p className="text-xs opacity-75 leading-relaxed">
            Es wird darauf hingewiesen, dass am Veranstaltungsort Fotos und/oder Videos angefertigt
            werden und zu Zwecken der Berichterstattung, Bewerbung und Dokumentation der
            Veranstaltung veröffentlicht werden können!
          </p>
        </div>
      </div>

      {/* Special Note - Full width if exists */}
      {event.specialNote && (
        <div className="card-glass p-6">
          <h3 className="text-lg font-semibold text-brand-accent mb-4 text-center">Special Note</h3>
          <p className="text-sm opacity-90 leading-relaxed">{event.specialNote}</p>
        </div>
      )}
    </div>
  </div>
);

export const MannerImGartenCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  const events = parseEventData();

  const tabs: TabItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="h-full w-full flex items-center justify-center py-4 px-6">
          <div className="max-w-4xl space-y-5">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">
                Männer im Garten & Männer im Rotlicht
              </h1>
              <p className="text-lg opacity-90 max-w-3xl mx-auto leading-relaxed mb-4">
                Als Event Organizer für Vangardist und OMG organisiere ich monatlich die größten
                queeren Party-Events in Wien. Die Männer im Garten Serie im Sommer und Männer im
                Rotlicht Events im Winter ziehen regelmäßig 500-1500 Besucher*innen an.
              </p>
              <p className="text-base opacity-80 max-w-2xl mx-auto leading-relaxed mb-5">
                Von intimen Season Openings bis hin zu euphorischen Pride Afterpartys - jedes Event
                wird sorgfältig kuratiert, um der queeren Community Wien&apos;s einen sicheren und
                feiernden Raum zu bieten.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-5">
                <div className="inline-block px-3 py-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full text-white text-sm font-medium">
                  {events.length} Events Organisiert
                </div>
                <div className="inline-block px-3 py-2 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full text-white text-sm font-medium">
                  500-1500 Gäste pro Event
                </div>
                <div className="inline-block px-3 py-2 bg-gradient-to-r from-zinc-600 to-zinc-500 rounded-full text-white text-sm font-medium">
                  2022-2025
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-75 leading-relaxed max-w-3xl mx-auto">
                Wir sind die Party für alle Gay, Lesbian, Queer, Trans, Non-Binary, Gender-Fluid
                sowie Drags, Bi-Boys and Bi-Girls, Straight Allies und alle, die es noch werden
                wollen.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    // Add all event tabs
    ...events.map(event => ({
      id: event.id,
      title: event.title,
      content: <EventContent event={event} />,
    })),
    {
      id: 'website',
      title: 'Website',
      content: (
        <div className="h-full w-full p-8 flex items-center justify-center">
          <div className="max-w-2xl space-y-6 text-center">
            <div className="text-6xl mb-4"></div>
            <h2 className="text-3xl font-bold text-white mb-4">Männer im Garten Website</h2>
            <p className="text-lg opacity-90 leading-relaxed mb-6">
              Die offizielle Website ist auf Readymag gehostet und kann aus Sicherheitsgründen nicht
              direkt eingebettet werden.
            </p>
            <div className="card-glass p-6 mb-6">
              <p className="text-sm opacity-80 leading-relaxed mb-4">
                <strong>Grund:</strong> Readymag verwendet X-Frame-Options und
                Content-Security-Policy Headers, die externes Iframe-Embedding aus
                Sicherheitsgründen verhindern.
              </p>
            </div>
            <a
              href="https://www.maenner-im-garten.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-accent to-brand-metallic hover:from-brand-accent/80 hover:to-brand-metallic/80 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Website besuchen</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <div className="text-xs opacity-60 mt-4">Öffnet in neuem Tab • Hosted by Readymag</div>
          </div>
        </div>
      ),
    },
  ];

  // Create comprehensive loading config
  const loadingConfig = {
    tabs: [
      { id: 'overview', title: 'Overview', priority: 'immediate' as const },
      ...events.slice(0, 5).map(event => ({
        id: event.id,
        title: event.title,
        priority: 'preload' as const,
      })),
      ...events.slice(5).map(event => ({
        id: event.id,
        title: event.title,
        priority: 'lazy' as const,
      })),
      { id: 'website', title: 'Website', hasGallery: false, priority: 'lazy' as const },
    ],
    images: [
      ...events.map((event, index) => ({
        id: `cover-${event.id}`,
        src: event.coverImage,
        alt: `${event.eventTitle} Cover`,
        priority: index < 5 ? ('high' as const) : ('low' as const),
        tabId: event.id,
      })),
    ],
  };

  return (
    <ContentWrapper
      id="manner-im-garten"
      tabs={tabs}
      className="h-full w-full"
      loadingConfig={loadingConfig}
    />
  );
};
