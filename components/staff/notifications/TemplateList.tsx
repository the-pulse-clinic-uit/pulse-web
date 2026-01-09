"use client";

import TemplateCard from "./TemplateCard";

interface Template {
    id: string;
    title: string;
    description: string;
}

interface TemplateListProps {
    templates: Template[];
    selectedTemplateId?: string;
    onSelectTemplate: (template: Template) => void;
}

export default function TemplateList({
    templates,
    selectedTemplateId,
    onSelectTemplate,
}: TemplateListProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notification Type
            </h3>

            <div className="space-y-3 mb-4">
                {templates.map((template) => (
                    <TemplateCard
                        key={template.id}
                        title={template.title}
                        description={template.description}
                        isSelected={template.id === selectedTemplateId}
                        onClick={() => onSelectTemplate(template)}
                    />
                ))}
            </div>
        </div>
    );
}
