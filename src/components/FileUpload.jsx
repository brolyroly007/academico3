import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import PropTypes from "prop-types";

export function FileUpload({ onFileChange, accept = ".pdf,.doc,.docx" }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
    }
  };
FileUpload.propTypes = {
  onFileChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
};
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="document">Documento de referencia (opcional)</Label>
      <div className="flex items-center gap-2">
        <Input
          id="document"
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="cursor-pointer"
        />
        <Button type="button" variant="outline" size="icon">
          <Upload className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Sube un documento de referencia para mejorar la generación del contenido
      </p>
    </div>
  );
}
