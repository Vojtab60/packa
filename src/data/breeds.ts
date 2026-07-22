import type { Breed } from '../types';

type BreedGroup = 'spolecensky' | 'rodinny' | 'sportovni' | 'pastevecky' | 'lovecky' | 'hlidaci' | 'seversky' | 'teriér' | 'obr' | 'alergici';
type BreedSeed = [string, string, string, number, string[], BreedGroup, string, string, string];

const profiles: Record<BreedGroup, Pick<Breed, 'temperament' | 'suitableFor' | 'activity'>> = {
  spolecensky: {
    temperament: 'Kontaktní, citlivý a silně orientovaný na člověka.',
    suitableFor: 'Pro majitele, kteří chtějí parťáka do bytu, na kratší výlety a každodenní blízký kontakt.',
    activity: 'Krátké procházky, hra, jemný výcvik a pravidelný režim.'
  },
  rodinny: {
    temperament: 'Přátelský, vyrovnaný a dobře čitelný při správné socializaci.',
    suitableFor: 'Pro rodiny a začátečníky, kteří počítají s výchovou, pohybem a společným časem.',
    activity: 'Denní procházky, poslušnost, čichání, aport nebo klidné výlety.'
  },
  sportovni: {
    temperament: 'Rychlý, učenlivý a pracovní pes, který potřebuje zaměstnat hlavu.',
    suitableFor: 'Pro aktivní lidi, sportovní kynologii, běh, turistiku nebo agility.',
    activity: 'Hodně pohybu, trénink sebekontroly, nosework a řízený odpočinek.'
  },
  pastevecky: {
    temperament: 'Chytrý, pozorný a často velmi vnímavý k pohybu lidí i zvířat.',
    suitableFor: 'Pro majitele, kteří chtějí trénovat a rozumí potřebě klidu i práce.',
    activity: 'Práce hlavou, poslušnost, triky, pasení nebo sport s jasnými pravidly.'
  },
  lovecky: {
    temperament: 'Samostatný, nosově výrazný a venku často velmi motivovaný stopou.',
    suitableFor: 'Pro lidi, kteří mají rádi dlouhé procházky, stopování a bezpečný management venku.',
    activity: 'Čichací hry, stopování, dlouhé procházky a dobře nacvičené přivolání.'
  },
  hlidaci: {
    temperament: 'Sebevědomý, loajální a ostražitý, potřebuje klidné a férové vedení.',
    suitableFor: 'Pro zkušenější majitele, kteří zvládnou socializaci, hranice a pravidelný výcvik.',
    activity: 'Poslušnost, klidová práce, kontrolovaný pohyb a dobrá socializace.'
  },
  seversky: {
    temperament: 'Nezávislý, odolný a aktivní pes s výraznou chutí k pohybu.',
    suitableFor: 'Pro sportovní majitele, kteří počítají s chlupy, tahem a samostatností.',
    activity: 'Běh, tahové sporty, turistika a bezpečné venčení.'
  },
  teriér: {
    temperament: 'Živý, odvážný a často velmi vynalézavý pes s vlastním názorem.',
    suitableFor: 'Pro majitele, kteří chtějí menšího, ale energického psa s jasnou výchovou.',
    activity: 'Hra, trénink přivolání, čichání, krátké sportovní bloky.'
  },
  obr: {
    temperament: 'Klidnější, důstojný a silný pes, který potřebuje prostor a dobré návyky.',
    suitableFor: 'Pro majitele s místem, časem na socializaci a ochotou řešit váhu i klouby.',
    activity: 'Pozvolný pohyb, klidné procházky, posilování návyků a žádné přetěžování v růstu.'
  },
  alergici: {
    temperament: 'Učenlivý, kontaktní a často vhodný pro lidi, kteří chtějí méně línající srst.',
    suitableFor: 'Pro byt, aktivní rodiny i alergiky, ale vždy je nutné ověřit reakci konkrétního člověka.',
    activity: 'Pravidelný střih, hra, učení triků, procházky a mentální práce.'
  }
};

const seeds: BreedSeed[] = [
  ['affenpinscher', 'Affenpinscher', 'malý', 3, ['byt', 'začátečník'], 'spolecensky', 'affenpinscher', 'Hlídá se chrup, oči a správná váha.', 'Drsná srst, pravidelné kartáčování a úprava.'],
  ['airedale-terier', 'Airedale teriér', 'střední', 4, ['sport', 'zahrada'], 'teriér', 'airedale', 'Potřebuje pevné přivolání a pravidelnou práci hlavou.', 'Drsná srst, trimování několikrát ročně.'],
  ['akita-inu', 'Akita inu', 'velký', 3, ['zahrada'], 'hlidaci', 'akita', 'Důležitá je raná socializace a respekt k ostatním psům.', 'Hustá srst, výrazné línání v sezoně.'],
  ['appenzellsky-salasnicky', 'Appenzellský salašnický pes', 'střední', 4, ['sport', 'zahrada'], 'pastevecky', 'appenzeller', 'Nudí se bez práce a může být hlasitý.', 'Krátká srst, snadná údržba.'],
  ['australska-kelpie', 'Australská kelpie', 'střední', 5, ['sport', 'zahrada'], 'pastevecky', 'australian/kelpie', 'Potřebuje hodně zaměstnání a učit vypínat.', 'Krátká srst, nenáročná péče.'],
  ['australsky-ovcak', 'Australský ovčák', 'střední', 5, ['sport', 'děti', 'zahrada'], 'pastevecky', 'australian/shepherd', 'Hlídat přetížení, reaktivitu a citlivost na ruch.', 'Polodlouhá srst, pravidelné kartáčování.'],
  ['basenji', 'Basenji', 'malý', 4, ['byt', 'sport'], 'lovecky', 'basenji', 'Mívá silný lovecký pud a samostatné rozhodování.', 'Krátká čistotná srst, minimální péče.'],
  ['beagle', 'Bígl', 'střední', 4, ['děti', 'začátečník'], 'lovecky', 'beagle', 'Nos ho snadno odvede, přivolání se trénuje dlouhodobě.', 'Krátká srst, hlídat uši a váhu.'],
  ['bluetick-coonhound', 'Bluetick coonhound', 'velký', 4, ['sport', 'zahrada'], 'lovecky', 'bluetick', 'Potřebuje prostor, stopování a bezpečné venčení.', 'Krátká srst, pravidelná kontrola uší.'],
  ['barzoj', 'Barzoj', 'velký', 3, ['zahrada'], 'lovecky', 'borzoi', 'Silný lovecký pud, volný pohyb jen v bezpečí.', 'Dlouhá srst, kartáčování a péče o tlapky.'],
  ['flandersky-bouvier', 'Flanderský bouvier', 'velký', 4, ['zahrada', 'sport'], 'hlidaci', 'bouvier', 'Potřebuje socializaci a klidné vedení síly.', 'Hrubá srst, pravidelné stříhání nebo trimování.'],
  ['boxer', 'Boxer', 'velký', 4, ['děti', 'sport'], 'rodinny', 'boxer', 'Hlídat dýchání v horku, srdce a klouby.', 'Krátká srst, snadná péče.'],
  ['brabantik', 'Brabantík', 'malý', 3, ['byt', 'začátečník'], 'spolecensky', 'brabancon', 'Citlivý na samotu a chlad.', 'Krátká srst, jednoduchá péče.'],
  ['briard', 'Briard', 'velký', 4, ['zahrada', 'sport'], 'pastevecky', 'briard', 'Potřebuje jasné hranice a pečlivou socializaci.', 'Dlouhá srst, časté kartáčování.'],
  ['norsky-buhund', 'Norský buhund', 'střední', 4, ['sport', 'děti'], 'seversky', 'buhund/norwegian', 'Může být štěkavý, pomáhá práce a rutina.', 'Hustá srst, sezonní línání.'],
  ['bostonsky-terier', 'Bostonský teriér', 'malý', 3, ['byt', 'děti', 'začátečník'], 'spolecensky', 'bulldog/boston', 'Hlídat přehřátí a dýchání.', 'Krátká srst, snadná údržba.'],
  ['anglicky-buldok', 'Anglický buldok', 'střední', 2, ['byt', 'začátečník'], 'spolecensky', 'bulldog/english', 'Důležité je dýchání, kůže, váha a horko.', 'Krátká srst, péče o kožní záhyby.'],
  ['francouzsky-buldocek', 'Francouzský buldoček', 'malý', 2, ['byt', 'začátečník'], 'spolecensky', 'bulldog/french', 'Hlídat dýchání, páteř, horko a váhu.', 'Krátká srst, péče o záhyby a uši.'],
  ['stafordsirsky-bulterier', 'Stafordšírský bulteriér', 'střední', 4, ['sport', 'děti'], 'teriér', 'bullterrier/staffordshire', 'Potřebuje dobrou socializaci a bezpečnou hru.', 'Krátká srst, snadná péče.'],
  ['australsky-honacky-pes', 'Australský honácký pes', 'střední', 5, ['sport', 'zahrada'], 'pastevecky', 'cattledog/australian', 'Bez práce může vymýšlet vlastní úkoly.', 'Krátká odolná srst.'],
  ['cavapoo', 'Cavapoo', 'malý', 3, ['byt', 'děti', 'alergici'], 'alergici', 'cavapoo', 'U kříženců se vlastnosti srsti i povahy liší.', 'Vlnitá srst, časté česání a střih.'],
  ['civava', 'Čivava', 'malý', 2, ['byt', 'začátečník'], 'spolecensky', 'chihuahua', 'Pozor na zuby, křehkost a přehnané nošení.', 'Krátká nebo dlouhá srst podle typu.'],
  ['cau-cau', 'Čau-čau', 'střední', 2, ['byt', 'zahrada'], 'hlidaci', 'chow', 'Potřebuje respekt, socializaci a péči o kůži.', 'Velmi hustá srst, pravidelné česání.'],
  ['clumber-spanel', 'Clumber španěl', 'střední', 2, ['děti', 'začátečník'], 'lovecky', 'clumber', 'Hlídat váhu, oči, uši a klouby.', 'Hustší srst, kartáčování a péče o uši.'],
  ['cockapoo', 'Cockapoo', 'malý', 3, ['byt', 'děti', 'alergici'], 'alergici', 'cockapoo', 'Může být velmi kontaktní a špatně snášet samotu.', 'Vlnitá srst, stříhání a česání.'],
  ['border-kolie', 'Border kolie', 'střední', 5, ['sport', 'zahrada'], 'pastevecky', 'collie/border', 'Hlídat přetížení, fixace na pohyb a stres.', 'Polodlouhá srst, pravidelné kartáčování.'],
  ['coonhound', 'Coonhound', 'velký', 4, ['sport', 'zahrada'], 'lovecky', 'coonhound', 'Silný hlas a nos, vyžaduje bezpečný prostor.', 'Krátká srst, kontrola uší.'],
  ['welsh-corgi-cardigan', 'Welsh corgi cardigan', 'malý', 3, ['byt', 'děti'], 'pastevecky', 'corgi/cardigan', 'Hlídat záda, váhu a skákání z výšky.', 'Střední srst, sezonní línání.'],
  ['coton-de-tulear', 'Coton de Tulear', 'malý', 2, ['byt', 'děti', 'alergici'], 'spolecensky', 'cotondetulear', 'Citlivý na samotu, potřebuje jemné zacházení.', 'Jemná srst, časté česání.'],
  ['jezevcik', 'Jezevčík', 'malý', 3, ['byt'], 'lovecky', 'dachshund', 'Zásadní je hlídat záda, váhu a schody.', 'Krátká, dlouhá nebo drsná srst podle rázu.'],
  ['dalmatin', 'Dalmatin', 'velký', 5, ['sport', 'děti'], 'sportovni', 'dalmatian', 'Potřebuje hodně pohybu, hlídat močové cesty a sluch.', 'Krátká srst, líná průběžně.'],
  ['nemecka-doga', 'Německá doga', 'velký', 2, ['zahrada'], 'obr', 'dane/great', 'Důležité jsou klouby, růst, žaludek a kvalitní výživa.', 'Krátká srst, snadná péče.'],
  ['skotsky-jelenar', 'Skotský jelení pes', 'velký', 3, ['zahrada', 'sport'], 'lovecky', 'deerhound/scottish', 'Volný pohyb jen v bezpečném prostoru.', 'Hrubší srst, pravidelné pročesání.'],
  ['dobrman', 'Dobrman', 'velký', 5, ['sport', 'zahrada'], 'hlidaci', 'doberman', 'Potřebuje socializaci, výcvik a hlídat srdce.', 'Krátká srst, snadná péče.'],
  ['norsky-losi-pes', 'Norský losí pes', 'střední', 4, ['sport', 'zahrada'], 'seversky', 'elkhound/norwegian', 'Může být nezávislý a hlasitý.', 'Hustá srst, výrazné línání.'],
  ['entlebussky-salasnicky', 'Entlebušský salašnický pes', 'střední', 4, ['sport', 'zahrada'], 'pastevecky', 'entlebucher', 'Potřebuje práci, socializaci a jisté vedení.', 'Krátká srst, nenáročná péče.'],
  ['americky-eskymacky-pes', 'Americký eskymácký pes', 'střední', 4, ['byt', 'sport'], 'spolecensky', 'eskimo', 'Chytrý pes, který se nudí bez tréninku.', 'Bílá hustá srst, pravidelné česání.'],
  ['finsky-laponsky-pes', 'Finský laponský pes', 'střední', 3, ['děti', 'zahrada'], 'seversky', 'finnish/lapphund', 'Hlídat samostatnost a sezonní línání.', 'Hustá srst do chladu, časté česání.'],
  ['bisonek', 'Bišonek', 'malý', 2, ['byt', 'děti', 'alergici'], 'alergici', 'frise/bichon', 'Pozor na chrup, oči a separační potíže.', 'Kudrnatá srst, pravidelný střih.'],
  ['nemecky-ovcak', 'Německý ovčák', 'velký', 5, ['sport', 'zahrada'], 'hlidaci', 'german/shepherd', 'Hlídat kyčle, lokty a dobrou socializaci.', 'Střední srst, výrazné línání.'],
  ['italsky-chrtik', 'Italský chrtík', 'malý', 3, ['byt'], 'spolecensky', 'greyhound/italian', 'Křehčí stavba, pozor na chlad a pády.', 'Krátká srst, v zimě potřebuje obleček.'],
  ['groenendael', 'Belgický ovčák groenendael', 'velký', 5, ['sport', 'zahrada'], 'pastevecky', 'groenendael', 'Citlivý pracovní pes, potřebuje zkušené vedení.', 'Dlouhá černá srst, pravidelné česání.'],
  ['havansky-psik', 'Havanský psík', 'malý', 2, ['byt', 'děti', 'začátečník'], 'spolecensky', 'havanese', 'Citlivý na samotu a nepravidelný režim.', 'Dlouhá srst, česání nebo praktický střih.'],
  ['afgansky-chrt', 'Afghánský chrt', 'velký', 3, ['zahrada'], 'lovecky', 'hound/afghan', 'Samostatný chrt, volný pohyb jen bezpečně.', 'Dlouhá srst, náročná péče.'],
  ['baset', 'Baset', 'střední', 2, ['děti', 'začátečník'], 'lovecky', 'hound/basset', 'Hlídat záda, uši, oči a váhu.', 'Krátká srst, pravidelná péče o uši.'],
  ['bloodhound', 'Bloodhound', 'velký', 3, ['zahrada'], 'lovecky', 'hound/blood', 'Velmi silný nos, potřebuje bezpečné vedení venku.', 'Krátká srst, péče o uši a kožní záhyby.'],
  ['ibizsky-podenko', 'Ibizský podenco', 'střední', 4, ['sport'], 'lovecky', 'hound/ibizan', 'Výrazný lovecký pud a skákavost.', 'Krátká nebo hrubá srst, snadná péče.'],
  ['plottuv-honic', 'Plottův honič', 'velký', 4, ['sport', 'zahrada'], 'lovecky', 'hound/plott', 'Potřebuje čichovou práci a dobré přivolání.', 'Krátká srst, snadná péče.'],
  ['treeing-walker-coonhound', 'Treeing Walker coonhound', 'velký', 4, ['sport', 'zahrada'], 'lovecky', 'hound/walker', 'Hlasitý stopař, vhodnější do aktivního prostředí.', 'Krátká srst, kontrola uší.'],
  ['sibirsky-husky', 'Sibiřský husky', 'střední', 5, ['sport', 'zahrada'], 'seversky', 'husky', 'Samostatnost, tah a útěky je potřeba řídit.', 'Hustá srst, velmi výrazné línání.'],
  ['keeshond', 'Keeshond', 'střední', 3, ['byt', 'děti'], 'spolecensky', 'keeshond', 'Může být hlasitý hlídač domácnosti.', 'Bohatá srst, pravidelné česání.'],
  ['kelpie', 'Kelpie', 'střední', 5, ['sport', 'zahrada'], 'pastevecky', 'kelpie', 'Vysoká potřeba práce, jinak hledá vlastní zábavu.', 'Krátká srst, nenáročná péče.'],
  ['komondor', 'Komondor', 'velký', 2, ['zahrada'], 'hlidaci', 'komondor', 'Silný hlídací instinkt, není pro každého začátečníka.', 'Provazcovitá srst, specifická péče.'],
  ['kuvasz', 'Kuvasz', 'velký', 3, ['zahrada'], 'hlidaci', 'kuvasz', 'Potřebuje prostor, socializaci a jasné hranice.', 'Hustá bílá srst, pravidelné česání.'],
  ['labradoodle', 'Labradoodle', 'střední', 4, ['děti', 'alergici', 'sport'], 'alergici', 'labradoodle', 'Vlastnosti srsti a energie se mohou lišit podle linie.', 'Vlnitá srst, česání a střih.'],
  ['labradorsky-retrivr', 'Labradorský retrívr', 'velký', 4, ['děti', 'sport', 'začátečník'], 'rodinny', 'labrador', 'Hlídat váhu, klouby a nepřekrmovat.', 'Krátká hustá srst, pravidelné línání.'],
  ['leonberger', 'Leonberger', 'velký', 3, ['děti', 'zahrada'], 'obr', 'leonberg', 'Důležitá je váha, klouby, srdce a nepřehřívání.', 'Dlouhá hustá srst, časté česání.'],
  ['lhasa-apso', 'Lhasa apso', 'malý', 2, ['byt'], 'spolecensky', 'lhasa', 'Může být nezávislý a ostražitý.', 'Dlouhá srst, česání nebo pravidelný střih.'],
  ['aljassky-malamut', 'Aljašský malamut', 'velký', 4, ['sport', 'zahrada'], 'seversky', 'malamute', 'Silný tah, samostatnost a lovecký pud.', 'Hustá srst, masivní sezonní línání.'],
  ['belgicky-ovcak-malinois', 'Belgický ovčák malinois', 'velký', 5, ['sport'], 'sportovni', 'malinois', 'Velmi náročný pracovní pes, ne pro běžný klidný režim.', 'Krátká srst, snadná péče.'],
  ['maltezsky-psik', 'Maltézský psík', 'malý', 2, ['byt', 'alergici', 'začátečník'], 'alergici', 'maltese', 'Hlídat zuby, slzení očí a citlivost na samotu.', 'Dlouhá jemná srst, česání nebo střih.'],
  ['bullmastif', 'Bullmastif', 'velký', 2, ['zahrada'], 'hlidaci', 'mastiff/bull', 'Síla a hlídání vyžadují socializaci a kontrolu váhy.', 'Krátká srst, snadná péče.'],
  ['anglicky-mastif', 'Anglický mastif', 'velký', 2, ['zahrada'], 'obr', 'mastiff/english', 'Hlídat klouby, srdce, váhu a žaludek.', 'Krátká srst, snadná péče.'],
  ['tibetska-doga', 'Tibetská doga', 'velký', 2, ['zahrada'], 'hlidaci', 'mastiff/tibetan', 'Silný hlídač s nezávislou povahou.', 'Velmi hustá srst, pravidelné česání.'],
  ['mexicky-nahac', 'Mexický naháč', 'střední', 3, ['byt', 'alergici'], 'spolecensky', 'mexicanhairless', 'Nahá kůže potřebuje ochranu před sluncem a chladem.', 'Bez srsti nebo krátká srst, péče o kůži.'],
  ['bernsky-salasnicky', 'Bernský salašnický pes', 'velký', 2, ['děti', 'zahrada'], 'obr', 'mountain/bernese', 'Krátší délka života, hlídat klouby a horko.', 'Dlouhá srst, pravidelné česání.'],
  ['velky-svycarsky-salasnicky', 'Velký švýcarský salašnický pes', 'velký', 3, ['děti', 'zahrada'], 'obr', 'mountain/swiss', 'Důležitá je socializace, klouby a váha.', 'Krátká srst, snadná péče.'],
  ['novofundlandsky-pes', 'Novofundlandský pes', 'velký', 2, ['děti', 'zahrada'], 'obr', 'newfoundland', 'Hlídat srdce, klouby, horko a plavání bezpečně.', 'Hustá srst, časté česání.'],
  ['otterhound', 'Otterhound', 'velký', 3, ['sport', 'zahrada'], 'lovecky', 'otterhound', 'Silný nos, potřebuje trpělivý výcvik.', 'Hrubá srst, péče o uši.'],
  ['kavkazsky-pastevecky-pes', 'Kavkazský pastevecký pes', 'velký', 2, ['zahrada'], 'hlidaci', 'ovcharka/caucasian', 'Velmi silný hlídací pes jen pro zkušené majitele.', 'Hustá srst, pravidelné česání.'],
  ['papillon', 'Papillon', 'malý', 4, ['byt', 'sport', 'začátečník'], 'spolecensky', 'papillon', 'Malý, ale živý pes; pozor na křehkost.', 'Jemná srst, pravidelné pročesání uší.'],
  ['pekingsky-palacovy-psik', 'Pekingský palácový psík', 'malý', 2, ['byt'], 'spolecensky', 'pekinese', 'Hlídat dýchání, oči, horko a váhu.', 'Dlouhá srst, pravidelné česání.'],
  ['welsh-corgi-pembroke', 'Welsh corgi pembroke', 'malý', 3, ['byt', 'děti'], 'pastevecky', 'pembroke', 'Pozor na záda, váhu a skákání.', 'Střední srst, sezonní línání.'],
  ['trpaslici-pinc', 'Trpasličí pinč', 'malý', 4, ['byt', 'sport'], 'spolecensky', 'pinscher/miniature', 'Sebevědomý malý pes, potřebuje pravidla.', 'Krátká srst, ochrana před chladem.'],
  ['americky-pitbulterier', 'Americký pitbulteriér', 'střední', 4, ['sport'], 'teriér', 'pitbull', 'Důležitá socializace, bezpečná hra a zodpovědné vedení.', 'Krátká srst, snadná péče.'],
  ['nemecky-kratkosrsty-ohar', 'Německý krátkosrstý ohař', 'velký', 5, ['sport', 'zahrada'], 'lovecky', 'pointer/german', 'Potřebuje hodně pohybu, práci nosem a přivolání.', 'Krátká srst, snadná péče.'],
  ['pomeranian', 'Pomeranian', 'malý', 3, ['byt'], 'spolecensky', 'pomeranian', 'Může být hlasitý, hlídat zuby a kolena.', 'Hustá srst, pravidelné česání.'],
  ['stredni-pudl', 'Střední pudl', 'střední', 4, ['byt', 'sport', 'alergici'], 'alergici', 'poodle/medium', 'Potřebuje práci hlavou a pravidelný střih.', 'Kudrnatá srst, nelíná běžně, nutné česání.'],
  ['trpaslici-pudl', 'Trpasličí pudl', 'malý', 3, ['byt', 'alergici', 'začátečník'], 'alergici', 'poodle/miniature', 'Hlídat zuby, kolena a správnou socializaci.', 'Kudrnatá srst, pravidelné stříhání.'],
  ['kralovsky-pudl', 'Královský pudl', 'velký', 4, ['sport', 'děti', 'alergici'], 'alergici', 'poodle/standard', 'Aktivní pes, který potřebuje výcvik a péči o srst.', 'Kudrnatá srst, pravidelný střih.'],
  ['toy-pudl', 'Toy pudl', 'malý', 3, ['byt', 'alergici'], 'alergici', 'poodle/toy', 'Křehčí velikost, pozor na zuby a kolena.', 'Kudrnatá srst, časté česání.'],
  ['mops', 'Mops', 'malý', 2, ['byt', 'začátečník'], 'spolecensky', 'pug', 'Hlídat dýchání, horko, oči a váhu.', 'Krátká srst, péče o záhyby.'],
  ['pyrenejsky-horsky-pes', 'Pyrenejský horský pes', 'velký', 2, ['zahrada'], 'hlidaci', 'pyrenees', 'Silný samostatný hlídač, potřebuje prostor.', 'Hustá bílá srst, časté česání.'],
  ['zlaty-retrivr', 'Zlatý retrívr', 'velký', 4, ['děti', 'sport', 'začátečník'], 'rodinny', 'retriever/golden', 'Hlídat váhu, klouby, kůži a uši.', 'Středně dlouhá srst, pravidelné česání.'],
  ['chesapeake-bay-retrivr', 'Chesapeake Bay retrívr', 'velký', 4, ['sport', 'zahrada'], 'lovecky', 'retriever/chesapeake', 'Samostatnější retrívr, potřebuje práci a vodu.', 'Mastnější voděodolná srst, základní péče.'],
  ['flat-coated-retrivr', 'Flat coated retrívr', 'velký', 4, ['děti', 'sport'], 'rodinny', 'retriever/flatcoated', 'Veselý aktivní pes, hlídat klouby a zdraví linie.', 'Delší srst, pravidelné česání.'],
  ['rhodesky-ridgeback', 'Rhodéský ridgeback', 'velký', 4, ['sport', 'zahrada'], 'hlidaci', 'ridgeback/rhodesian', 'Sebevědomý pes, potřebuje socializaci a hranice.', 'Krátká srst, snadná péče.'],
  ['rotvajler', 'Rotvajler', 'velký', 4, ['sport', 'zahrada'], 'hlidaci', 'rottweiler', 'Síla, ochrannost a klouby vyžadují odpovědné vedení.', 'Krátká srst, snadná péče.'],
  ['dlouhosrsta-kolie', 'Dlouhosrstá kolie', 'velký', 3, ['děti', 'zahrada'], 'pastevecky', 'rough/collie', 'Citlivý pes, hlídat srst a reakce na léky dle linie.', 'Dlouhá srst, pravidelné česání.'],
  ['saluki', 'Saluki', 'velký', 3, ['sport'], 'lovecky', 'saluki', 'Chrt s loveckým pudem, volno jen bezpečně.', 'Jemná srst, ochrana před chladem.'],
  ['samojed', 'Samojed', 'střední', 4, ['děti', 'sport'], 'seversky', 'samoyed', 'Potřebuje pohyb, chlupatou údržbu a trpělivost.', 'Hustá bílá srst, velmi výrazné línání.'],
  ['schipperke', 'Schipperke', 'malý', 4, ['byt', 'sport'], 'spolecensky', 'schipperke', 'Energický hlídač, potřebuje zaměstnat.', 'Hustší srst, sezonní línání.'],
  ['velky-knirac', 'Velký knírač', 'velký', 5, ['sport', 'zahrada'], 'hlidaci', 'schnauzer/giant', 'Pracovní pes, potřebuje výcvik a socializaci.', 'Drsná srst, trimování nebo střih.'],
  ['maly-knirac', 'Malý knírač', 'malý', 4, ['byt', 'sport', 'alergici'], 'alergici', 'schnauzer/miniature', 'Může být hlasitý, potřebuje pravidla a práci.', 'Drsná srst, trimování.'],
  ['anglicky-setr', 'Anglický setr', 'velký', 4, ['sport', 'děti'], 'lovecky', 'setter/english', 'Lovecký pes, potřebuje pohyb a přivolání.', 'Delší srst, péče o uši.'],
  ['gordonsetr', 'Gordon setr', 'velký', 4, ['sport', 'zahrada'], 'lovecky', 'setter/gordon', 'Vytrvalý pes do přírody, potřebuje práci nosem.', 'Delší srst, pravidelné česání.'],
  ['irsky-setr', 'Irský setr', 'velký', 5, ['sport', 'děti'], 'lovecky', 'setter/irish', 'Energie a nadšení vyžadují trénink klidu.', 'Dlouhá srst, česání a péče o uši.'],
  ['sarpej', 'Šarpej', 'střední', 2, ['byt'], 'hlidaci', 'sharpei', 'Hlídat kůži, oči, uši a přehřátí.', 'Krátká srst, péče o kožní záhyby.'],
  ['bobtail', 'Bobtail', 'velký', 3, ['děti', 'zahrada'], 'pastevecky', 'sheepdog/english', 'Důležité je vedení srsti a nepřehřívání.', 'Velmi bohatá srst, náročná péče.'],
  ['seltie', 'Šeltie', 'malý', 4, ['byt', 'sport'], 'pastevecky', 'sheepdog/shetland', 'Citlivá, může být hlasitá a reagovat na ruch.', 'Dlouhá srst, pravidelné česání.']
];

export const breeds: Breed[] = seeds.map(([slug, name, size, energy, tags, group, imageApi, watchFor, coat]) => {
  const profile = profiles[group];

  return {
    slug,
    name,
    size,
    energy,
    tags,
    imageApi,
    coat,
    watchFor,
    temperament: profile.temperament,
    suitableFor: profile.suitableFor,
    activity: profile.activity,
    description: `${name} je ${size} pes s energií ${energy}/5. Nejlépe sedí do režimu: ${tags.join(', ')}.`,
    care: `${coat} ${watchFor}`
  };
});
