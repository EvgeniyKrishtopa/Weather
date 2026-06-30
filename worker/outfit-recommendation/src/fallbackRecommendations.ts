import type {
  FallbackWeatherFeel,
  OutfitRecommendation,
  OutfitRecommendationRequest,
  SupportedLanguage,
} from "./types";

const fallbackRecommendationItems = {
  woman: {
    cold: [
      "Insulated coat",
      "Thermal knit top",
      "Lined trousers",
      "Warm boots",
    ],
    mild: [
      "Light trench coat",
      "Long-sleeve blouse",
      "Tailored trousers",
      "Loafers",
    ],
    rainy: [
      "Water-resistant trench coat",
      "Warm knit layer",
      "Slim trousers",
      "Waterproof ankle boots",
    ],
    warm: [
      "Breathable blouse",
      "Light midi skirt",
      "Comfortable flats",
      "Sun hat",
    ],
    windy: [
      "Windproof jacket",
      "Layered blouse",
      "Straight-leg trousers",
      "Closed flats",
    ],
  },
  man: {
    cold: ["Warm parka", "Thermal crewneck", "Insulated chinos", "Warm boots"],
    mild: ["Light field jacket", "Oxford shirt", "Chinos", "Casual sneakers"],
    rainy: [
      "Water-resistant jacket",
      "Warm crewneck layer",
      "Chinos",
      "Waterproof sneakers",
    ],
    warm: ["Breathable polo", "Light chinos", "Comfortable sneakers", "Cap"],
    windy: ["Windbreaker", "Layered shirt", "Chinos", "Closed sneakers"],
  },
} as const;

const fallbackRecommendationCopy: Record<
  SupportedLanguage,
  Record<"woman" | "man", Record<FallbackWeatherFeel, OutfitRecommendation>>
> = {
  en: {
    woman: {
      cold: {
        title: "Warm layered outfit",
        items: [...fallbackRecommendationItems.woman.cold],
        description:
          "Insulating layers and warm shoes help balance the low feels-like temperature.",
      },
      mild: {
        title: "Comfortable everyday layers",
        items: [...fallbackRecommendationItems.woman.mild],
        description:
          "Light layers provide enough flexibility for the current temperature and wind.",
      },
      rainy: {
        title: "Rain-ready warm layers",
        items: [...fallbackRecommendationItems.woman.rainy],
        description:
          "Water-resistant outerwear and covered shoes keep the outfit practical for damp conditions.",
      },
      warm: {
        title: "Light warm-weather outfit",
        items: [...fallbackRecommendationItems.woman.warm],
        description:
          "Breathable pieces keep the outfit comfortable in warm current conditions.",
      },
      windy: {
        title: "Wind-smart layers",
        items: [...fallbackRecommendationItems.woman.windy],
        description:
          "A windproof outer layer keeps the outfit comfortable without adding too much bulk.",
      },
    },
    man: {
      cold: {
        title: "Warm layered outfit",
        items: [...fallbackRecommendationItems.man.cold],
        description:
          "Insulating layers and warm shoes help balance the low feels-like temperature.",
      },
      mild: {
        title: "Comfortable everyday layers",
        items: [...fallbackRecommendationItems.man.mild],
        description:
          "Light layers provide enough flexibility for the current temperature and wind.",
      },
      rainy: {
        title: "Rain-ready warm layers",
        items: [...fallbackRecommendationItems.man.rainy],
        description:
          "Water-resistant outerwear and covered shoes keep the outfit practical for damp conditions.",
      },
      warm: {
        title: "Light warm-weather outfit",
        items: [...fallbackRecommendationItems.man.warm],
        description:
          "Breathable pieces keep the outfit comfortable in warm current conditions.",
      },
      windy: {
        title: "Wind-smart layers",
        items: [...fallbackRecommendationItems.man.windy],
        description:
          "A windproof outer layer keeps the outfit comfortable without adding too much bulk.",
      },
    },
  },
  uk: {
    woman: {
      cold: {
        title: "Теплий багатошаровий образ",
        items: [
          "Утеплене пальто",
          "Термотрикотаж",
          "Штани з підкладкою",
          "Теплі черевики",
        ],
        description:
          "Утеплені шари та тепле взуття допомагають збалансувати низьку відчутну температуру.",
      },
      mild: {
        title: "Зручні повсякденні шари",
        items: [
          "Легкий тренч",
          "Блуза з довгим рукавом",
          "Класичні штани",
          "Лофери",
        ],
        description:
          "Легкі шари дають достатньо гнучкості для поточної температури й вітру.",
      },
      rainy: {
        title: "Теплі шари для дощу",
        items: [
          "Водовідштовхувальний тренч",
          "Теплий трикотаж",
          "Вузькі штани",
          "Водонепроникні ботильйони",
        ],
        description:
          "Водовідштовхувальний верхній шар і закрите взуття практичні для вологої погоди.",
      },
      warm: {
        title: "Легкий образ для теплої погоди",
        items: [
          "Дихаюча блуза",
          "Легка спідниця міді",
          "Зручні балетки",
          "Капелюх від сонця",
        ],
        description: "Дихаючі речі зберігають комфорт у теплу погоду.",
      },
      windy: {
        title: "Шари для вітряної погоди",
        items: [
          "Вітрозахисна куртка",
          "Блуза шарами",
          "Прямі штани",
          "Закриті балетки",
        ],
        description:
          "Вітрозахисний верхній шар додає комфорту без зайвого об'єму.",
      },
    },
    man: {
      cold: {
        title: "Теплий багатошаровий образ",
        items: [
          "Тепла парка",
          "Термосвітшот",
          "Утеплені чиноси",
          "Теплі черевики",
        ],
        description:
          "Утеплені шари та тепле взуття допомагають збалансувати низьку відчутну температуру.",
      },
      mild: {
        title: "Зручні повсякденні шари",
        items: [
          "Легка польова куртка",
          "Оксфордська сорочка",
          "Чиноси",
          "Повсякденні кросівки",
        ],
        description:
          "Легкі шари дають достатньо гнучкості для поточної температури й вітру.",
      },
      rainy: {
        title: "Теплі шари для дощу",
        items: [
          "Водовідштовхувальна куртка",
          "Теплий світшот",
          "Чиноси",
          "Водонепроникні кросівки",
        ],
        description:
          "Водовідштовхувальний верхній шар і закрите взуття практичні для вологої погоди.",
      },
      warm: {
        title: "Легкий образ для теплої погоди",
        items: ["Дихаюче поло", "Легкі чиноси", "Зручні кросівки", "Кепка"],
        description: "Дихаючі речі зберігають комфорт у теплу погоду.",
      },
      windy: {
        title: "Шари для вітряної погоди",
        items: ["Вітровка", "Сорочка шарами", "Чиноси", "Закриті кросівки"],
        description:
          "Вітрозахисний верхній шар додає комфорту без зайвого об'єму.",
      },
    },
  },
  ru: {
    woman: {
      cold: {
        title: "Теплый многослойный образ",
        items: [
          "Утепленное пальто",
          "Термотрикотаж",
          "Брюки с подкладкой",
          "Теплые ботинки",
        ],
        description:
          "Утепленные слои и теплая обувь помогают сбалансировать низкую ощущаемую температуру.",
      },
      mild: {
        title: "Удобные повседневные слои",
        items: [
          "Легкий тренч",
          "Блуза с длинным рукавом",
          "Классические брюки",
          "Лоферы",
        ],
        description:
          "Легкие слои дают гибкость для текущей температуры и ветра.",
      },
      rainy: {
        title: "Теплые слои для дождя",
        items: [
          "Водоотталкивающий тренч",
          "Теплый трикотаж",
          "Узкие брюки",
          "Водонепроницаемые ботильоны",
        ],
        description:
          "Водоотталкивающий верхний слой и закрытая обувь практичны для сырой погоды.",
      },
      warm: {
        title: "Легкий образ для теплой погоды",
        items: [
          "Дышащая блуза",
          "Легкая юбка миди",
          "Удобные балетки",
          "Шляпа от солнца",
        ],
        description: "Дышащие вещи сохраняют комфорт в теплых условиях.",
      },
      windy: {
        title: "Слои для ветреной погоды",
        items: [
          "Ветрозащитная куртка",
          "Блуза слоями",
          "Прямые брюки",
          "Закрытые балетки",
        ],
        description:
          "Ветрозащитный верхний слой сохраняет комфорт без лишнего объема.",
      },
    },
    man: {
      cold: {
        title: "Теплый многослойный образ",
        items: [
          "Теплая парка",
          "Термосвитшот",
          "Утепленные чиносы",
          "Теплые ботинки",
        ],
        description:
          "Утепленные слои и теплая обувь помогают сбалансировать низкую ощущаемую температуру.",
      },
      mild: {
        title: "Удобные повседневные слои",
        items: [
          "Легкая полевая куртка",
          "Оксфордская рубашка",
          "Чиносы",
          "Повседневные кроссовки",
        ],
        description:
          "Легкие слои дают гибкость для текущей температуры и ветра.",
      },
      rainy: {
        title: "Теплые слои для дождя",
        items: [
          "Водоотталкивающая куртка",
          "Теплый свитшот",
          "Чиносы",
          "Водонепроницаемые кроссовки",
        ],
        description:
          "Водоотталкивающий верхний слой и закрытая обувь практичны для сырой погоды.",
      },
      warm: {
        title: "Легкий образ для теплой погоды",
        items: ["Дышащее поло", "Легкие чиносы", "Удобные кроссовки", "Кепка"],
        description: "Дышащие вещи сохраняют комфорт в теплых условиях.",
      },
      windy: {
        title: "Слои для ветреной погоды",
        items: ["Ветровка", "Рубашка слоями", "Чиносы", "Закрытые кроссовки"],
        description:
          "Ветрозащитный верхний слой сохраняет комфорт без лишнего объема.",
      },
    },
  },
  es: {
    woman: {
      cold: {
        title: "Conjunto cálido por capas",
        items: [
          "Abrigo aislante",
          "Top térmico de punto",
          "Pantalones forrados",
          "Botas cálidas",
        ],
        description:
          "Las capas aislantes y los zapatos cálidos equilibran la baja sensación térmica.",
      },
      mild: {
        title: "Capas cómodas de diario",
        items: [
          "Gabardina ligera",
          "Blusa de manga larga",
          "Pantalones de vestir",
          "Mocasines",
        ],
        description:
          "Las capas ligeras dan flexibilidad para la temperatura y el viento actuales.",
      },
      rainy: {
        title: "Capas cálidas listas para la lluvia",
        items: [
          "Gabardina resistente al agua",
          "Capa de punto cálida",
          "Pantalones slim",
          "Botines impermeables",
        ],
        description:
          "La ropa exterior resistente al agua y el calzado cerrado son prácticos para la humedad.",
      },
      warm: {
        title: "Conjunto ligero para clima cálido",
        items: [
          "Blusa transpirable",
          "Falda midi ligera",
          "Bailarinas cómodas",
          "Sombrero para el sol",
        ],
        description:
          "Las prendas transpirables mantienen el confort en condiciones cálidas.",
      },
      windy: {
        title: "Capas inteligentes para viento",
        items: [
          "Chaqueta cortavientos",
          "Blusa en capas",
          "Pantalones rectos",
          "Bailarinas cerradas",
        ],
        description:
          "Una capa exterior cortavientos mantiene la comodidad sin añadir mucho volumen.",
      },
    },
    man: {
      cold: {
        title: "Conjunto cálido por capas",
        items: [
          "Parka cálida",
          "Sudadera térmica",
          "Chinos aislantes",
          "Botas cálidas",
        ],
        description:
          "Las capas aislantes y los zapatos cálidos equilibran la baja sensación térmica.",
      },
      mild: {
        title: "Capas cómodas de diario",
        items: [
          "Chaqueta ligera de campo",
          "Camisa oxford",
          "Chinos",
          "Zapatillas casuales",
        ],
        description:
          "Las capas ligeras dan flexibilidad para la temperatura y el viento actuales.",
      },
      rainy: {
        title: "Capas cálidas listas para la lluvia",
        items: [
          "Chaqueta resistente al agua",
          "Sudadera cálida",
          "Chinos",
          "Zapatillas impermeables",
        ],
        description:
          "La ropa exterior resistente al agua y el calzado cerrado son prácticos para la humedad.",
      },
      warm: {
        title: "Conjunto ligero para clima cálido",
        items: [
          "Polo transpirable",
          "Chinos ligeros",
          "Zapatillas cómodas",
          "Gorra",
        ],
        description:
          "Las prendas transpirables mantienen el confort en condiciones cálidas.",
      },
      windy: {
        title: "Capas inteligentes para viento",
        items: [
          "Cortavientos",
          "Camisa en capas",
          "Chinos",
          "Zapatillas cerradas",
        ],
        description:
          "Una capa exterior cortavientos mantiene la comodidad sin añadir mucho volumen.",
      },
    },
  },
  it: {
    woman: {
      cold: {
        title: "Look caldo a strati",
        items: [
          "Cappotto imbottito",
          "Top termico in maglia",
          "Pantaloni foderati",
          "Stivali caldi",
        ],
        description:
          "Strati isolanti e scarpe calde aiutano con la bassa temperatura percepita.",
      },
      mild: {
        title: "Strati comodi per tutti i giorni",
        items: [
          "Trench leggero",
          "Blusa a maniche lunghe",
          "Pantaloni sartoriali",
          "Mocassini",
        ],
        description:
          "Strati leggeri offrono flessibilità per temperatura e vento attuali.",
      },
      rainy: {
        title: "Strati caldi pronti per la pioggia",
        items: [
          "Trench resistente all'acqua",
          "Maglia calda",
          "Pantaloni slim",
          "Stivaletti impermeabili",
        ],
        description:
          "Capispalla resistenti all'acqua e scarpe chiuse sono pratici con l'umidità.",
      },
      warm: {
        title: "Look leggero per tempo caldo",
        items: [
          "Blusa traspirante",
          "Gonna midi leggera",
          "Ballerine comode",
          "Cappello da sole",
        ],
        description:
          "Capi traspiranti mantengono il comfort nelle condizioni calde.",
      },
      windy: {
        title: "Strati intelligenti per il vento",
        items: [
          "Giacca antivento",
          "Blusa a strati",
          "Pantaloni dritti",
          "Ballerine chiuse",
        ],
        description:
          "Uno strato esterno antivento mantiene il comfort senza troppo volume.",
      },
    },
    man: {
      cold: {
        title: "Look caldo a strati",
        items: [
          "Parka caldo",
          "Felpa termica",
          "Chino imbottiti",
          "Stivali caldi",
        ],
        description:
          "Strati isolanti e scarpe calde aiutano con la bassa temperatura percepita.",
      },
      mild: {
        title: "Strati comodi per tutti i giorni",
        items: [
          "Field jacket leggera",
          "Camicia oxford",
          "Chino",
          "Sneaker casual",
        ],
        description:
          "Strati leggeri offrono flessibilità per temperatura e vento attuali.",
      },
      rainy: {
        title: "Strati caldi pronti per la pioggia",
        items: [
          "Giacca resistente all'acqua",
          "Felpa calda",
          "Chino",
          "Sneaker impermeabili",
        ],
        description:
          "Capispalla resistenti all'acqua e scarpe chiuse sono pratici con l'umidità.",
      },
      warm: {
        title: "Look leggero per tempo caldo",
        items: [
          "Polo traspirante",
          "Chino leggeri",
          "Sneaker comode",
          "Cappellino",
        ],
        description:
          "Capi traspiranti mantengono il comfort nelle condizioni calde.",
      },
      windy: {
        title: "Strati intelligenti per il vento",
        items: [
          "Giacca antivento",
          "Camicia a strati",
          "Chino",
          "Sneaker chiuse",
        ],
        description:
          "Uno strato esterno antivento mantiene il comfort senza troppo volume.",
      },
    },
  },
  de: {
    woman: {
      cold: {
        title: "Warmer Lagenlook",
        items: [
          "Isolierter Mantel",
          "Thermo-Strickoberteil",
          "Gefütterte Hose",
          "Warme Stiefel",
        ],
        description:
          "Isolierende Schichten und warme Schuhe gleichen die niedrige gefühlte Temperatur aus.",
      },
      mild: {
        title: "Bequeme Alltagsschichten",
        items: [
          "Leichter Trenchcoat",
          "Langarmbluse",
          "Elegante Hose",
          "Loafer",
        ],
        description:
          "Leichte Schichten bieten Flexibilität für aktuelle Temperatur und Wind.",
      },
      rainy: {
        title: "Warme Schichten für Regen",
        items: [
          "Wasserabweisender Trenchcoat",
          "Warme Strickschicht",
          "Schmale Hose",
          "Wasserdichte Stiefeletten",
        ],
        description:
          "Wasserabweisende Oberbekleidung und geschlossene Schuhe sind bei Nässe praktisch.",
      },
      warm: {
        title: "Leichtes Outfit für warmes Wetter",
        items: [
          "Atmungsaktive Bluse",
          "Leichter Midirock",
          "Bequeme Ballerinas",
          "Sonnenhut",
        ],
        description:
          "Atmungsaktive Teile bleiben bei warmen Bedingungen angenehm.",
      },
      windy: {
        title: "Windkluge Schichten",
        items: [
          "Winddichte Jacke",
          "Bluse im Lagenlook",
          "Gerade Hose",
          "Geschlossene Ballerinas",
        ],
        description:
          "Eine winddichte Außenschicht hält angenehm warm ohne zu viel Volumen.",
      },
    },
    man: {
      cold: {
        title: "Warmer Lagenlook",
        items: [
          "Warmer Parka",
          "Thermo-Sweatshirt",
          "Isolierte Chinos",
          "Warme Stiefel",
        ],
        description:
          "Isolierende Schichten und warme Schuhe gleichen die niedrige gefühlte Temperatur aus.",
      },
      mild: {
        title: "Bequeme Alltagsschichten",
        items: [
          "Leichte Fieldjacket",
          "Oxford-Hemd",
          "Chinos",
          "Freizeit-Sneaker",
        ],
        description:
          "Leichte Schichten bieten Flexibilität für aktuelle Temperatur und Wind.",
      },
      rainy: {
        title: "Warme Schichten für Regen",
        items: [
          "Wasserabweisende Jacke",
          "Warme Sweatshirt-Schicht",
          "Chinos",
          "Wasserdichte Sneaker",
        ],
        description:
          "Wasserabweisende Oberbekleidung und geschlossene Schuhe sind bei Nässe praktisch.",
      },
      warm: {
        title: "Leichtes Outfit für warmes Wetter",
        items: [
          "Atmungsaktives Polo",
          "Leichte Chinos",
          "Bequeme Sneaker",
          "Kappe",
        ],
        description:
          "Atmungsaktive Teile bleiben bei warmen Bedingungen angenehm.",
      },
      windy: {
        title: "Windkluge Schichten",
        items: [
          "Windbreaker",
          "Hemd im Lagenlook",
          "Chinos",
          "Geschlossene Sneaker",
        ],
        description:
          "Eine winddichte Außenschicht hält angenehm warm ohne zu viel Volumen.",
      },
    },
  },
  fr: {
    woman: {
      cold: {
        title: "Tenue chaude en couches",
        items: [
          "Manteau isolant",
          "Haut thermique en maille",
          "Pantalon doublé",
          "Bottes chaudes",
        ],
        description:
          "Des couches isolantes et des chaussures chaudes équilibrent la faible température ressentie.",
      },
      mild: {
        title: "Couches confortables du quotidien",
        items: [
          "Trench léger",
          "Blouse à manches longues",
          "Pantalon ajusté",
          "Mocassins",
        ],
        description:
          "Des couches légères donnent de la flexibilité pour la température et le vent actuels.",
      },
      rainy: {
        title: "Couches chaudes prêtes pour la pluie",
        items: [
          "Trench déperlant",
          "Couche en maille chaude",
          "Pantalon slim",
          "Bottines imperméables",
        ],
        description:
          "Un extérieur déperlant et des chaussures fermées restent pratiques par temps humide.",
      },
      warm: {
        title: "Tenue légère pour temps chaud",
        items: [
          "Blouse respirante",
          "Jupe midi légère",
          "Ballerines confortables",
          "Chapeau de soleil",
        ],
        description:
          "Des pièces respirantes gardent le confort par temps chaud.",
      },
      windy: {
        title: "Couches adaptées au vent",
        items: [
          "Veste coupe-vent",
          "Blouse en couches",
          "Pantalon droit",
          "Ballerines fermées",
        ],
        description:
          "Une couche extérieure coupe-vent garde le confort sans ajouter trop de volume.",
      },
    },
    man: {
      cold: {
        title: "Tenue chaude en couches",
        items: [
          "Parka chaude",
          "Sweat thermique",
          "Chino isolant",
          "Bottes chaudes",
        ],
        description:
          "Des couches isolantes et des chaussures chaudes équilibrent la faible température ressentie.",
      },
      mild: {
        title: "Couches confortables du quotidien",
        items: [
          "Veste de terrain légère",
          "Chemise oxford",
          "Chino",
          "Baskets casual",
        ],
        description:
          "Des couches légères donnent de la flexibilité pour la température et le vent actuels.",
      },
      rainy: {
        title: "Couches chaudes prêtes pour la pluie",
        items: [
          "Veste déperlante",
          "Sweat chaud",
          "Chino",
          "Baskets imperméables",
        ],
        description:
          "Un extérieur déperlant et des chaussures fermées restent pratiques par temps humide.",
      },
      warm: {
        title: "Tenue légère pour temps chaud",
        items: [
          "Polo respirant",
          "Chino léger",
          "Baskets confortables",
          "Casquette",
        ],
        description:
          "Des pièces respirantes gardent le confort par temps chaud.",
      },
      windy: {
        title: "Couches adaptées au vent",
        items: ["Coupe-vent", "Chemise en couches", "Chino", "Baskets fermées"],
        description:
          "Une couche extérieure coupe-vent garde le confort sans ajouter trop de volume.",
      },
    },
  },
};

export const createFallbackRecommendation = (
  request: OutfitRecommendationRequest,
): OutfitRecommendation => {
  const condition = request.condition.toLowerCase();
  const feelsCold = request.feelsLike <= 5;
  const feelsWarm = request.feelsLike >= 24;
  const feelsRainy =
    condition.includes("rain") ||
    condition.includes("drizzle") ||
    request.humidity >= 85;
  const feelsWindy = request.windSpeed >= 8;

  const fallbackWeatherFeel: FallbackWeatherFeel = feelsRainy
    ? "rainy"
    : feelsCold
      ? "cold"
      : feelsWindy
        ? "windy"
        : feelsWarm
          ? "warm"
          : "mild";

  return fallbackRecommendationCopy[request.language][request.gender][
    fallbackWeatherFeel
  ];
};
