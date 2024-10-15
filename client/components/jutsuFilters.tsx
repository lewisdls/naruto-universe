import { getNatures, getKekkeiGenkais, getClassifications } from "@/api/global";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";

interface FiltersProps {
  onFilterChange: (selectedFilters: {
    natures: string[];
    kekkeiGenkais: string[];
    classifications: string[];
    name: string;
  }) => void;
}

interface Nature {
  id: number;
  attributes: {
    name: string;
    image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

interface Classification {
  id: number;
  attributes: {
    name: string;
  };
}

interface KekkeiGenkai {
  id: number;
  attributes: {
    name: string;
    image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

const JutsuFilters = ({ onFilterChange }: FiltersProps) => {
  const [selectedNatures, setSelectedNatures] = useState<string[]>([]);
  const [selectedKekkeiGenkais, setSelectedKekkeiGenkais] = useState<string[]>(
    []
  );
  const [selectedClassifications, setSelectedClassifications] = useState<
    string[]
  >([]);
  const [name, setName] = useState("");
  const [natures, setNatures] = useState<Nature[]>([]);
  const [kekkeiGenkais, setKekkeiGenkais] = useState<KekkeiGenkai[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);

  // Fetch clans and villages from Strapi
  useEffect(() => {
    const fetchNatures = async () => {
      try {
        const res = await getNatures();
        setNatures(res.data);
      } catch (error) {
        console.error("Error fetching natures: ", error);
      }
    };

    const fetchKekkeiGenkais = async () => {
      try {
        const res = await getKekkeiGenkais();
        setKekkeiGenkais(res.data);
      } catch (error) {
        console.error("Error fetching kekkei genkais: ", error);
      }
    };

    const fetchClassifications = async () => {
      try {
        const res = await getClassifications();
        setClassifications(res.data);
      } catch (error) {
        console.error("Error fetching classifcations: ", error);
      }
    };

    fetchNatures();
    fetchKekkeiGenkais();
    fetchClassifications();
  }, []);

  const handleNatureChange = (nature: string) => {
    setSelectedNatures((prevNatures) =>
      prevNatures.includes(nature)
        ? prevNatures.filter((n) => n !== nature)
        : [...prevNatures, nature]
    );
  };

  const handleKekkeiGenkaiChange = (kekkeiGenkai: string) => {
    setSelectedKekkeiGenkais((prevKekkeiGenkais) =>
      prevKekkeiGenkais.includes(kekkeiGenkai)
        ? prevKekkeiGenkais.filter((k) => k !== kekkeiGenkai)
        : [...prevKekkeiGenkais, kekkeiGenkai]
    );
  };

  const handleClassificationChange = (classification: string) => {
    setSelectedClassifications((prevClassifications) =>
      prevClassifications.includes(classification)
        ? prevClassifications.filter((c) => c !== classification)
        : [...prevClassifications, classification]
    );
  };

  // Debounce filter changes and avoid infinite loops
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange({
        natures: selectedNatures,
        kekkeiGenkais: selectedKekkeiGenkais,
        classifications: selectedClassifications,
        name: name,
      });
    }, 300); // Delay the update by 300ms to debounce

    return () => clearTimeout(timeoutId); // Clear the timeout if the effect is cleaned up
  }, [selectedNatures, selectedKekkeiGenkais, selectedClassifications, name]);

  return (
    <div className="flex flex-col py-4 px-8">
      <h1 className="font-semibold text-2xl">Filters</h1>
      <Input
        placeholder="Name"
        className="my-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl">
            Classifications
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            {classifications.map((classification) => (
              <div key={classification.id} className="flex items-center gap-1">
                <Checkbox
                  id={classification.attributes.name.toLowerCase()}
                  checked={selectedClassifications.includes(
                    classification.attributes.name
                  )}
                  onCheckedChange={() =>
                    handleClassificationChange(classification.attributes.name)
                  }
                />
                <label
                  htmlFor={classification.attributes.name.toLowerCase()}
                  className="text-base leading-none"
                >
                  {classification.attributes.name}
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl">Natures</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            {natures.map((nature) => (
              <div key={nature.id} className="flex items-center gap-1 w-max">
                <Checkbox
                  id={nature.attributes.name.toLowerCase()}
                  checked={selectedNatures.includes(nature.attributes.name)}
                  onCheckedChange={() =>
                    handleNatureChange(nature.attributes.name)
                  }
                />
                <label
                  htmlFor={nature.attributes.name.toLowerCase()}
                  className="flex items-center gap-2 text-base leading-none"
                >
                  {nature.attributes.name}{" "}
                  <img
                    src={`http://localhost:1337${nature.attributes.image.data.attributes.url}`}
                    className="h-5"
                    alt=""
                  />
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl">
            Kekkei Genkais
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            {kekkeiGenkais.map((kekkeiGenkai) => (
              <div key={kekkeiGenkai.id} className="flex items-center gap-1">
                <Checkbox
                  id={kekkeiGenkai.attributes.name.toLowerCase()}
                  checked={selectedKekkeiGenkais.includes(
                    kekkeiGenkai.attributes.name
                  )}
                  onCheckedChange={() =>
                    handleKekkeiGenkaiChange(kekkeiGenkai.attributes.name)
                  }
                />
                <label
                  htmlFor={kekkeiGenkai.attributes.name.toLowerCase()}
                  className="flex items-center gap-2 text-base leading-tight"
                >
                  {kekkeiGenkai.attributes.name}{" "}
                  <img
                    src={`http://localhost:1337${kekkeiGenkai.attributes.image.data.attributes.url}`}
                    className="h-5"
                    alt=""
                  />
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default JutsuFilters;
