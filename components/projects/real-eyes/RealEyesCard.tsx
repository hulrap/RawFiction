import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { TabContainer } from '../../shared/TabContainer';
import type { ProjectProps, TabItem, RealEyesEventData } from '../../shared/types';
import { REAL_EYES_EVENTS } from '../../shared/types';

// Helper function to dynamically get gallery images for each event
const getGalleryImages = (eventId: string): string[] => {
  // Map event IDs to their folder numbers
  const eventFolderMap: Record<string, number> = {
    'real-eyes-1': 1,
    'real-eyes-2': 2,
    'real-eyes-3': 3,
    'real-eyes-4': 4,
    'real-eyes-5': 5,
    'real-eyes-6': 6,
    'real-eyes-7': 7,
    'real-eyes-8': 8,
    'real-eyes-9': 9,
    'real-eyes-10': 10,
  };

  const folderNumber = eventFolderMap[eventId];
  if (!folderNumber) return [];

  // Base path for the event folder
  const basePath = `/projects/real-eyes-content/Real Eyes ${folderNumber}/Fotoalbum`;

  // For events that don't have galleries (like Real Eyes 7, 8, 9, 10)
  if (folderNumber >= 7) return [];

  // Dynamic image lists based on actual folder contents
  const imageFiles: Record<number, string[]> = {
    1: [
      '31919568_362141064193539_5284616460662996992_n.jpg',
      '485711469_1890885034652460_3732015535572981449_n.jpg',
      '485772339_1890884947985802_6477074824897912745_n.jpg',
      '485775941_1890885067985790_5539845508191895027_n.jpg',
      '485797196_1890885091319121_2691396773914118843_n.jpg',
      '485797378_1890884987985798_3594591902649944069_n.jpg',
      '485797443_1890885207985776_5311596210304527759_n.jpg',
      '485798016_1890885151319115_632807568412610910_n.jpg',
      '485799612_1890885181319112_293189151857428895_n.jpg',
      '485801151_1890884881319142_2938874369187130225_n.jpg',
      '485803546_1890885147985782_3458859440967196775_n.jpg',
      '485803930_1890884934652470_848291640033630866_n.jpg',
      '485804365_1890884864652477_512716549191914704_n.jpg',
      '485804519_1890885211319109_5928329593099586565_n.jpg',
      '485805567_1890885131319117_6154385789144127966_n.jpg',
      '485807841_1890885121319118_1399379032522559952_n.jpg',
      '485975949_1890885287985768_3516246528107532201_n.jpg',
      '485986533_1890885177985779_7003192261397469937_n.jpg',
      '485992593_1890885294652434_7942511224184970111_n.jpg',
      '485993202_1890884851319145_8711764336376164104_n.jpg',
      '486022859_1890884951319135_5894892916417835609_n.jpg',
      '486025770_1890885227985774_883849164595642201_n.jpg',
      '486026806_1890885127985784_2630144343690028827_n.jpg',
      '486038256_1890885217985775_2021407074948515020_n.jpg',
      '486045747_1890884954652468_8844161515267407547_n.jpg',
      '486050085_1890885024652461_1787867564751840270_n.jpg',
      '486055580_1890885001319130_1309145815610796230_n.jpg',
      '486058733_1890885291319101_2197743565155725041_n.jpg',
      '486061546_1890884957985801_7224221910877050980_n.jpg',
      '486068013_1890884997985797_835616332183014897_n.jpg',
      '486069995_1890885161319114_2553145106594998634_n.jpg',
      '486115434_1890885214652442_6106576742774508078_n.jpg',
      '486116388_1890884861319144_4144093707966167139_n.jpg',
      '486117576_1890884971319133_483453074736014196_n.jpg',
      '486136230_1890885081319122_1752137939888620701_n.jpg',
      '486149820_1890885174652446_6726929962074792216_n.jpg',
      '486155061_1890885101319120_3598684527575539670_n.jpg',
      '486157798_1890885284652435_6284874838662198049_n.jpg',
      '486167679_1890885061319124_6954109203516200399_n.jpg',
      '486168635_1890885144652449_7943107518839520274_n.jpg',
      '486169874_1890885064652457_7821136171210590649_n.jpg',
      '486174368_1890885111319119_1049537734508276179_n.jpg',
      '486176624_1890885197985777_2990647710479459507_n.jpg',
      '486178990_1890884874652476_6981422011566568016_n.jpg',
      '486244708_1890885071319123_3689065907030956178_n.jpg',
      '486248038_1890885314652432_8109372727790917078_n.jpg',
      '486248307_1890884891319141_7223276977161048465_n.jpg',
      '486253813_1890885031319127_5525624396832919299_n.jpg',
      '486281501_1890885311319099_6406563874878091553_n.jpg',
      '486350053_1890885184652445_6052937955619848981_n.jpg',
      '486367253_1890885094652454_2964887752151054050_n.jpg',
      '486436374_1890884841319146_4313001157967591902_n.jpg',
      '486460938_1890885104652453_5629755236072543207_n.jpg',
      '486638058_1890885307985766_3045817060446183869_n.jpg',
    ],
    2: [
      '486315814_1892585514482412_1356729723564081673_n.jpg',
      '486315814_1892585891149041_2952437637027360559_n.jpg',
      '486320945_1892585481149082_1379515498946181518_n.jpg',
      '486339601_1892585831149047_8730956479741098288_n.jpg',
      '486360163_1892585607815736_3584921293285595028_n.jpg',
      '486362349_1892585627815734_538762315660116993_n.jpg',
      '486365471_1892585887815708_1145742412379181752_n.jpg',
      '486368439_1892585511149079_1618111073344599142_n.jpg',
      '486369442_1892585861149044_287782499299473324_n.jpg',
      '486370031_1892585487815748_2057606537455281235_n.jpg',
      '486372288_1892585734482390_6431411160370324396_n.jpg',
      '486376200_1892585477815749_7778318117240943082_n.jpg',
      '486387800_1892585581149072_1266506764714819743_n.jpg',
      '486387810_1892585467815750_6790588296153397093_n.jpg',
      '486391996_1892585461149084_6398127829440634329_n.jpg',
      '486393076_1892585747815722_319656751816199692_n.jpg',
      '486396449_1892585754482388_4993009134038117551_n.jpg',
      '486396639_1892585807815716_5186541302691045015_n.jpg',
      '486396679_1892585554482408_700810159609274130_n.jpg',
      '486398405_1892585597815737_6790059681249287338_n.jpg',
      '486409763_1892585551149075_985165058992183634_n.jpg',
      '486429173_1892585724482391_2549071152488072920_n.jpg',
      '486431808_1892585761149054_1043754894948824016_n.jpg',
      '486453079_1892585897815707_8992044917991377936_n.jpg',
      '486454244_1892585594482404_7685596172138088116_n.jpg',
      '486462204_1892585601149070_604703700984748767_n.jpg',
      '486466930_1892585731149057_514801386509000598_n.jpg',
      '486468506_1892585617815735_4686924275317006197_n.jpg',
      '486473021_1892585491149081_7169362266032493893_n.jpg',
      '486492504_1892585894482374_6685399654526812423_n.jpg',
      '486498970_1892585881149042_5965076957892231210_n.jpg',
      '486513865_1892585504482413_3004824767502477751_n.jpg',
      '486519568_1892585431149087_5479664951023836914_n.jpg',
      '486525982_1892585497815747_7061788456383886966_n.jpg',
      '486527171_1892585821149048_8473793235631760059_n.jpg',
      '486527411_1892585904482373_3166246484815155392_n.jpg',
      '486534618_1892585884482375_6329831857294641513_n.jpg',
      '486538393_1892585534482410_2162591998483414586_n.jpg',
      '486537079_1892585874482376_67265846867198176_n.jpg',
      '486543472_1892585907815706_6481705589927408474_n.jpg',
      '486547432_1892585774482386_7025607249098511357_n.jpg',
      '486563282_1892585911149039_8636177042123096066_n.jpg',
      '486572295_1892585737815723_3326803595939438454_n.jpg',
      '486572653_1892585877815709_5952170852238058437_n.jpg',
      '486572850_1892585624482401_7502084416400769229_n.jpg',
      '486573505_1892585834482380_6701836092109903411_n.jpg',
      '486573561_1892585801149050_5461280390525971224_n.jpg',
      '486574324_1892585714482392_2333723308586577394_n.jpg',
      '486574800_1892585864482377_7144210387182536467_n.jpg',
      '486574939_1892585867815710_6722747407131070755_n.jpg',
      '486575081_1892585577815739_3714511156188601200_n.jpg',
      '486575669_1892585557815741_7940014910882551690_n.jpg',
      '486576033_1892585917815705_3962872545356025262_n.jpg',
      '486576205_1892585547815742_4087873553030925900_n.jpg',
      '486576476_1892585507815746_7197861216263727566_n.jpg',
      '486601704_1892585777815719_4160652255084182156_n.jpg',
      '486601931_1892585771149053_154017365313253894_n.jpg',
      '486602422_1892585567815740_3416770132583024091_n.jpg',
      '486602903_1892585424482421_9104193018941915757_n.jpg',
      '486603321_1892585561149074_1437421443668546744_n.jpg',
      '486603886_1892585914482372_4502179930965020057_n.jpg',
      '486608520_1892585871149043_6128169103952797588_n.jpg',
      '486608761_1892585571149073_1998607587550224919_n.jpg',
      '486609662_1892585901149040_5901559244666522984_n.jpg',
      '486610991_1892585444482419_3781020581842028501_n.jpg',
      '486611170_1892585711149059_1898811353692920982_n.jpg',
      '486612280_1892585751149055_4657917878554681917_n.jpg',
    ],
    3: [
      '486582448_1893807667693530_5531033811231256657_n.jpg',
      '486604553_1893807377693559_5846049929400720816_n.jpg',
      '486616931_1893807621026868_2555431798260383113_n.jpg',
      '486616955_1893807391026891_3834635933525738074_n.jpg',
      '486620744_1893807431026887_317448222808323278_n.jpg',
      '486650709_1893807534360210_4341672830103309158_n.jpg',
      '486665657_1893807507693546_10154468905540273_n.jpg',
      '486670290_1893807774360186_4068721966716546041_n.jpg',
      '486670299_1893807354360228_5222872722481556586_n.jpg',
      '486674585_1893807487693548_7811375169219453902_n.jpg',
      '486697607_1893807347693562_5822864386734702638_n.jpg',
      '486712612_1893807684360195_6483218481911352379_n.jpg',
      '486736848_1893807784360185_2301273807394763792_n.jpg',
      '486755692_1893807687693528_3786535404040824195_n.jpg',
      '486780426_1893807527693544_551898080582857379_n.jpg',
      '486792325_1893807407693556_2212170617785977875_n.jpg',
      '486799045_1893807447693552_5719978658114166862_n.jpg',
      '486811469_1893807751026855_7589355308511809000_n.jpg',
      '486811592_1893807791026851_5382470079250166499_n.jpg',
      '486813247_1893807744360189_1167705368184150765_n.jpg',
      '486821894_1893807497693547_426483686040899318_n.jpg',
      '486824616_1893807724360191_785773894518897561_n.jpg',
      '486826005_1893807494360214_280981312335552929_n.jpg',
      '486829356_1893807677693529_5342514308414810666_n.jpg',
      '486853975_1893807717693525_4603118219621904132_n.jpg',
      '486859349_1893807451026885_2645144617735574782_n.jpg',
      '486869822_1893807397693557_4861587476875790785_n.jpg',
      '486937458_1893807767693520_3461575783154053262_n.jpg',
      '486937509_1893807747693522_1118357853054083402_n.jpg',
      '486993842_1893807771026853_4423013902623148213_n.jpg',
      '487005711_1893807714360192_5881949895441729612_n.jpg',
      '487050613_1893807734360190_5834774742519300820_n.jpg',
      '487066169_1893807681026862_438262881045601639_n.jpg',
      '487069273_1893807481026882_3323279797685408131_n.jpg',
      '487069303_1893807801026850_3943172077110909128_n.jpg',
      '487073052_1893807754360188_5465991311995387939_n.jpg',
      '487112104_1893807797693517_351805260715099040_n.jpg',
      '487136474_1893807671026863_8078346373815899280_n.jpg',
      '487155382_1893807624360201_6813059969361878691_n.jpg',
      '487173428_1893807491026881_7504282598981374156_n.jpg',
      '487197366_1893807434360220_405935869598963333_n.jpg',
      '487209942_1893807721026858_1253624065794123385_n.jpg',
      '487291396_1893807804360183_9171604910313677910_n.jpg',
      '487312545_1893807777693519_3951672832898168770_n.jpg',
    ],
    4: [
      '30415206_354539608287018_6271748400828383232_n.jpg',
      '30415213_354539351620377_6947673345802371072_n.jpg',
      '30415366_354538554953790_4357804286743150592_n.jpg',
      '30415366_354538554953790_4357804286743150592_n (1).jpg',
      '30415418_354539491620363_2999288500177600512_n.jpg',
      '30440937_354539638287015_5444422929502699520_n.jpg',
      '30440997_354539081620404_3500118559185436672_n.jpg',
      '30441134_354540031620309_5520848737208893440_n.jpg',
      '30441216_354539764953669_5264525149113155584_n.jpg',
      '30441269_354538858287093_8946069474843295744_n.jpg',
      '30441456_354539394953706_4636886468453728256_n.jpg',
      '30442468_354538651620447_7223849045834334208_n.jpg',
      '30442468_354538651620447_7223849045834334208_n (1).jpg',
      '30442896_354539511620361_654717745086070784_n.jpg',
      '30443166_354538964953749_7771419747865853952_n.jpg',
      '30443563_354538668287112_3426533661892149248_n.jpg',
      '30443563_354538668287112_3426533661892149248_n (1).jpg',
      '30515733_354539031620409_3692386150330138624_n.jpg',
      '30515987_354539538287025_7595265211863400448_n.jpg',
      '30516493_354539204953725_7109816388520247296_n.jpg',
      '30516612_354539311620381_5212757422963163136_n.jpg',
      '30530436_354538914953754_5241601761898135552_n.jpg',
      '30530601_354538518287127_2066823032604721152_n.jpg',
      '30530601_354538518287127_2066823032604721152_n (1).jpg',
      '30530609_354539254953720_3387371737770360832_n.jpg',
      '30530844_354539274953718_800347785307095040_n.jpg',
      '30531154_354539871620325_1794873971234045952_n.jpg',
      '30531223_354538524953793_5527344879539060736_n.jpg',
      '30531223_354538524953793_5527344879539060736_n (1).jpg',
      '30531278_354539978286981_6515119454186110976_n.jpg',
      '30531419_354539894953656_7196934427115520000_n.jpg',
      '30571948_354538874953758_1784932908650201088_n.jpg',
      '30572032_354538688287110_2488690908149579776_n.jpg',
      '30572032_354538688287110_2488690908149579776_n (1).jpg',
      '30581347_354539671620345_6335828887682940928_n.jpg',
      '30581938_354538984953747_1412013821895114752_n.jpg',
      '30594610_354538808287098_4953080521971204096_n.jpg',
      '30623946_354540008286978_3503284375284350976_n.jpg',
      'Screenshot 2025-06-27 211153.png',
    ],
    5: [
      '34807299_374174306323548_5887444743046037504_n.jpg',
      '34859459_374174269656885_2391658964048674816_n.jpg',
      '34859464_374174572990188_701975725510492160_n.jpg',
      '34864407_374174679656844_3941848691379273728_n.jpg',
      '34866709_374174759656836_1085375941217091584_n.jpg',
      '34907777_374174549656857_132907307708186624_n.jpg',
      '34962953_374174339656878_4524995414977413120_n.jpg',
      '35052134_374174282990217_2647502748462874624_n.jpg',
      '35077301_374174402990205_4689094093744111616_n.jpg',
      '35126925_374174606323518_8898430032603512832_n.jpg',
      '35148078_374174532990192_3371514018433859584_n.jpg',
    ],
    6: [
      '47485891_481718992235745_4297510827172298752_n.jpg',
      '47575871_481717258902585_8527478719474827264_n.jpg',
      '47681759_481716908902620_1274577363799113728_n.jpg',
      '47683182_481716875569290_7996048599030956032_n.jpg',
      '47686166_481718125569165_3557520066952036352_n.jpg',
      '47686531_481717202235924_9075987841795751936_n.jpg',
      '47689168_481717658902545_65845894506872832_n.jpg',
      '47689603_481718242235820_127094713718145024_n.jpg',
      '48020607_481719438902367_3095389419922784256_n.jpg',
      '48031335_481719378902373_4016843347262963712_n.jpg',
      '48039941_481716615569316_7906489309614571520_n.jpg',
      '48045782_481719882235656_2879111028858159104_n.jpg',
      '48046330_481718458902465_717261453987414016_n.jpg',
      '48046778_481717802235864_3082684348315467776_n.jpg',
      '48051544_481717832235861_8427019795198640128_n.jpg',
      '48064376_481719015569076_3650290462897471488_n.jpg',
      '48077748_481716792235965_1977509084605186048_n.jpg',
      '48087317_481719938902317_5039156245018181632_n.jpg',
      '48087322_481716972235947_4093016894359994368_n.jpg',
      '48090119_481717035569274_7296340740806803456_n.jpg',
      '48092416_481717685569209_9214288683534909440_n.jpg',
      '48166139_481718055569172_8945879787612667904_n.jpg',
      '48166345_481717505569227_5069993921224900608_n.jpg',
      '48177999_481720108902300_5119745512416739328_n.jpg',
      '48178022_481718208902490_5966823001465815040_n.jpg',
      '48182288_481716588902652_1798593464451989504_n.jpg',
      '48186547_481718088902502_2181348339847528448_n.jpg',
      '48225543_481716842235960_1866418793421471744_n.jpg',
      '48246012_481718112235833_643337237097873408_n.jpg',
      '48246032_481716602235984_5793260160398917632_n.jpg',
      '48246047_481717605569217_4454121943422992384_n.jpg',
      '48247047_481718832235761_4231359298497675264_n.jpg',
      '48247076_481718152235829_382401631515312128_n.jpg',
      '48254013_481719775569000_4076512030826168320_n.jpg',
      '48268762_481718452235799_4558201482180034560_n.jpg',
      '48268949_481719995568978_8206635664507142144_n.jpg',
      '48269207_481717445569233_848247923471810560_n.jpg',
      '48269218_481719222235722_4782098956249202688_n.jpg',
      '48269234_481716645569313_2524588721550917632_n.jpg',
      '48269383_481718752235769_2274274930868617216_n.jpg',
      '48270366_481720132235631_3114703084694011904_n.jpg',
      '48270700_481717078902603_1224533143600496640_n.jpg',
      '48270844_481719342235710_8894420276905771008_n.jpg',
      '48275091_481718672235777_5463683298024751104_n.jpg',
      '48275324_481719395569038_3542853543910178816_n.jpg',
      '48275476_481717092235935_882600880086450176_n.jpg',
      '48281791_481716948902616_8276358175020548096_n.jpg',
      '48283403_481716755569302_717019651623616512_n.jpg',
      '48314131_481718565569121_5148206886297796608_n.jpg',
      '48314847_481716822235962_1068146748628664320_n.jpg',
      '48336039_481718812235763_7024865440098680832_n.jpg',
      '48350205_481717018902609_6509743495161315328_n.jpg',
      '48350208_481718185569159_1819772721282678784_n.jpg',
      '48355159_481717368902574_2551071163480539136_n.jpg',
      '48355406_481718268902484_2711031469458849792_n.jpg',
      '48355544_481717065569271_6864416633130057728_n.jpg',
      '48356715_481717415569236_8536181319648935936_n.jpg',
      '48357307_481717535569224_4388153784082104320_n.jpg',
      '48358217_481717875569190_5716765942453633024_n.jpg',
      '48358420_481716725569305_4270937387770576896_n.jpg',
      '48358508_481717542235890_4271876198902005760_n.jpg',
      '48358884_481718822235762_4248424960206307328_n.jpg',
      '48360243_481717145569263_6813963798332833792_n.jpg',
      '48360303_481717928902518_8996400581677416448_n.jpg',
      '48361095_481718412235803_2618119395427221504_n.jpg',
      '48361356_481717728902538_1279979985980882944_n.jpg',
      '48361716_481719645569013_7917295335662157824_n.jpg',
      '48362714_481717225569255_6388594545189191680_n.jpg',
      '48363275_481719192235725_3417778220735397888_n.jpg',
      '48363717_481718632235781_7558345389519142912_n.jpg',
      '48364882_481716708902640_4688636662547218432_n.jpg',
      '48365213_481718918902419_5786110414240612352_n.jpg',
      '48366080_481716865569291_3797926093931937792_n.jpg',
      '48366916_481717292235915_4052729216360251392_n.jpg',
      '48366976_481719085569069_9180019100825419776_n.jpg',
      '48368335_481719152235729_3246261892930338816_n.jpg',
      '48368740_481720175568960_6213765328720101376_n.jpg',
      '48368854_481718895569088_7359825618776621056_n.jpg',
      '48369019_481720045568973_8946015542938959872_n.jpg',
      '48369986_481717638902547_6502787361833746432_n.jpg',
      '48370293_481717338902577_8285561989288165376_n.jpg',
      '48371199_481718592235785_2106521548465635328_n.jpg',
      '48372072_481717462235898_619889704958951424_n.jpg',
      '48372824_481717855569192_2767668374262513664_n.jpg',
      '48373944_481719965568981_2675531404388859904_n.jpg',
      '48374176_481716765569301_2125103956400013312_n.jpg',
      '48374524_481718472235797_1493714089958965248_n.jpg',
      '48375037_481720092235635_7285942423119724544_n.jpg',
      '48377290_481718658902445_680976303255453696_n.jpg',
      '48378455_481716652235979_760809265567891456_n.jpg',
      '48379639_481717948902516_5695467783748321280_n.jpg',
      '48383755_481718288902482_948867470934933504_n.jpg',
      '48384105_481717382235906_7638352431151054848_n.jpg',
      '48388580_481717898902521_3326716504514232320_n.jpg',
      '48390879_481717235569254_5811333129377415168_n.jpg',
      '48396605_481717708902540_4047649640143650816_n.jpg',
      '48398874_481717772235867_2966773020766502912_n.jpg',
      '48402974_481717985569179_7192333056852623360_n.jpg',
      '48412871_481717578902553_7372438945587527680_n.jpg',
    ],
  };

  const files = imageFiles[folderNumber] || [];
  return files.map(filename => `${basePath}/${filename}`);
};

const EventBanner: React.FC<{ bannerImage: string; title: string }> = ({ bannerImage, title }) => (
  <div className="w-full mb-6">
    <Image
      src={bannerImage}
      alt={`${title} Banner`}
      width={800}
      height={400}
      className="w-full h-auto object-contain rounded-lg"
      priority
    />
  </div>
);

const EventContent: React.FC<{ event: RealEyesEventData }> = ({ event }) => (
  <div className="space-y-8 h-full overflow-y-auto">
    <EventBanner bannerImage={event.bannerImage} title={event.title} />

    <div className="text-center">
      <h2 className="heading-section mb-2">{event.title}</h2>
      {event.date && event.location && (
        <div className="text-sm opacity-75 mb-4">
          {event.date} • {event.location}
        </div>
      )}
      <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed mb-6 text-center">
        {event.description}
      </p>
    </div>

    {event.longDescription && (
      <div className="card-glass p-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-sm opacity-90 leading-relaxed whitespace-pre-line">
            {event.longDescription}
          </p>
        </div>
      </div>
    )}

    {event.lineup && event.lineup.length > 0 && (
      <div className="card-anthracite p-6">
        <h3 className="heading-card mb-4 text-center">Line-Up</h3>
        <div className="space-y-2">
          {event.lineup.map((artist, index) => (
            <div key={index} className="flex items-start gap-3 justify-center">
              <div className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm opacity-90">{artist}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {event.highlights && event.highlights.length > 0 && (
      <div className="card-glass p-6">
        <h3 className="heading-card mb-4 text-center">Highlights</h3>
        <div className="space-y-2">
          {event.highlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-3 justify-center">
              <div className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm opacity-90">{highlight}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {event.hardFacts && Object.keys(event.hardFacts).length > 0 && (
      <div className="card-anthracite p-6">
        <h3 className="heading-card mb-4 text-center">Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(event.hardFacts).map(([key, value]) => (
            <div key={key} className="flex flex-col text-center">
              <span className="text-xs opacity-75 font-medium">{key}</span>
              <span className="text-sm opacity-90">{value}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {event.links && event.links.length > 0 && (
      <div className="card-glass p-6">
        <h3 className="heading-card mb-4 text-center">Links</h3>
        <div className="space-y-2 text-center">
          {event.links.map((link, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm opacity-90 hover:opacity-100 hover:text-brand-accent transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    )}

    {/* Special Images for Real Eyes 9 */}
    {event.specialImages && event.specialImages.length > 0 && (
      <div className="pb-8">
        <h3 className="heading-card mb-4 text-center">Impressions</h3>
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {event.specialImages.map((image, index) => (
            <div
              key={index}
              className="card-glass p-0 overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={image}
                alt={`${event.title} - Impression ${index + 1}`}
                width={300}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const Gallery: React.FC<{ eventId: string; eventTitle: string }> = ({ eventId, eventTitle }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [priorityImages, setPriorityImages] = useState<Set<string>>(new Set());
  const galleryImages = getGalleryImages(eventId);

  const handleImageClick = (image: string) => {
    // Immediately prioritize the clicked image
    setPriorityImages(prev => new Set([...prev, image]));
    setSelectedImage(image);

    // Set loading state for the modal image
    setLoadingStates(prev => ({ ...prev, [`modal-${image}`]: true }));
  };

  const handleImageLoad = (imageId: string) => {
    setLoadingStates(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageError = (imageId: string) => {
    setLoadingStates(prev => ({ ...prev, [imageId]: false }));
  };

  if (galleryImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <div className="text-3xl mb-4">📸</div>
          <h3 className="text-lg font-semibold mb-2">No Gallery Available</h3>
          <p className="text-sm text-gray-600">Gallery images are not available for this event.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      <div className="text-center">
        <h2 className="heading-section mb-4">Photo Gallery</h2>
        <p className="text-sm opacity-75">Click on images to view them larger</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
        {galleryImages.map((image, index) => {
          const thumbnailId = `thumb-${index}`;
          const isPriority = priorityImages.has(image) || index < 8; // First 8 images get priority

          return (
            <div
              key={index}
              className="card-glass p-0 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 relative"
              onClick={() => handleImageClick(image)}
            >
              <Image
                src={image}
                alt={`${eventTitle} - Photo ${index + 1}`}
                width={200}
                height={150}
                className="w-full h-32 object-cover"
                priority={isPriority}
                loading={isPriority ? 'eager' : 'lazy'}
                onLoad={() => handleImageLoad(thumbnailId)}
                onError={() => handleImageError(thumbnailId)}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7Dw=="
              />

              {loadingStates[thumbnailId] && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-full">
            {/* Loading indicator for modal image */}
            {loadingStates[`modal-${selectedImage}`] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-70 rounded-lg p-6 flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white text-sm">Loading high resolution image...</p>
                </div>
              </div>
            )}

            <Image
              src={selectedImage}
              alt="Gallery Image"
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              priority={true} // Always prioritize modal images
              loading="eager"
              onLoad={() => handleImageLoad(`modal-${selectedImage}`)}
              onError={() => handleImageError(`modal-${selectedImage}`)}
              quality={95} // High quality for modal view
            />

            {/* Close button */}
            <button
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-colors"
              onClick={e => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              ✕
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
              {galleryImages.indexOf(selectedImage) + 1} of {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const VideoPlayer: React.FC<{ videoFile: string; eventTitle: string }> = ({
  videoFile,
  eventTitle,
}) => (
  <div className="space-y-6 h-full overflow-y-auto">
    <div className="text-center">
      <h2 className="heading-section mb-4">After Video</h2>
      <p className="text-sm opacity-75">{eventTitle} - Event aftermovie</p>
    </div>

    <div className="card-glass p-6">
      <div className="relative rounded-lg overflow-hidden">
        <video
          controls
          className="w-full h-auto rounded-lg"
          poster={`/projects/real-eyes-content/Real Eyes 2/banner.jpg`}
          preload="metadata"
        >
          <source src={videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs opacity-60">
          Click play to watch the official aftermovie from {eventTitle}
        </p>
      </div>
    </div>
  </div>
);

// Background Video Component for the entire Real Eyes window
const BackgroundVideo: React.FC = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover blur-sm opacity-20 scale-110"
      poster="/projects/real-eyes-content/Real Eyes 2/banner.jpg"
      preload="auto"
    >
      <source
        src="/projects/real-eyes-content/Real Eyes 2/Aftervideo/realeyes.mp4"
        type="video/mp4"
      />
    </video>

    {/* Subtle overlay to blend with content */}
    <div className="absolute inset-0 bg-black opacity-40"></div>
  </div>
);

export const RealEyesCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  const createEventTabs = useCallback((event: RealEyesEventData): TabItem[] => {
    const tabs: TabItem[] = [
      {
        id: `${event.id}-event`,
        title: 'Event',
        content: <EventContent event={event} />,
      },
    ];

    if (event.hasGallery) {
      tabs.push({
        id: `${event.id}-gallery`,
        title: 'Fotoalbum',
        content: <Gallery eventId={event.id} eventTitle={event.title} />,
      });
    }

    if (event.hasVideo && event.videoFile) {
      tabs.push({
        id: `${event.id}-video`,
        title: 'Aftervideo',
        content: <VideoPlayer videoFile={event.videoFile} eventTitle={event.title} />,
      });
    }

    return tabs;
  }, []);

  const mainTabs: TabItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="space-y-8 h-full overflow-y-auto">
          <div className="text-center">
            <h1 className="heading-main mb-6">Real Eyes</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Real Eyes is a transformative event series that explores the intersection of
              technology, consciousness, and human experience through immersive hip-hop experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="card-glass p-6">
              <h3 className="heading-card mb-4">Our Mission</h3>
              <p className="text-sm opacity-75 leading-relaxed">
                Celebrating 90s hip hop culture while creating spaces where people can explore new
                perspectives on reality, consciousness, and human potential through carefully
                curated experiences.
              </p>
            </div>

            <div className="card-glass p-6">
              <h3 className="heading-card mb-4">Event Series</h3>
              <p className="text-sm opacity-75 leading-relaxed">
                Ten unique events spanning from 2017 to 2024, each exploring different aspects of
                hip-hop culture and featuring international and local artists.
              </p>
            </div>
          </div>

          <div className="card-anthracite p-8 text-center mb-8">
            <h3 className="heading-card mb-4">10 Events</h3>
            <p className="text-sm opacity-75 mb-6">
              Each event offers a unique journey into the realms of hip-hop culture, featuring
              world-class artists and unforgettable experiences.
            </p>
          </div>
        </div>
      ),
    },
    ...REAL_EYES_EVENTS.map((event: RealEyesEventData, index: number) => ({
      id: event.id,
      title: `Event ${index + 1}`,
      content: (
        <div className="h-full">
          <TabContainer
            key={event.id}
            tabs={createEventTabs(event)}
            defaultTab={`${event.id}-event`}
            className="h-full"
          />
        </div>
      ),
    })),
  ];

  return (
    <div className="h-full w-full relative">
      {/* Background Video */}
      <BackgroundVideo />

      {/* Main Content */}
      <div className="relative z-10 h-full">
        <TabContainer tabs={mainTabs} defaultTab="overview" className="h-full" />
      </div>
    </div>
  );
};
