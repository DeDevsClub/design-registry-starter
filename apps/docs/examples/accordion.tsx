import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/shadcn-ui/components/ui/accordion';

export default function AccordionExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other components' aesthetic.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
