// src/components/CoverGenerator.jsx
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileUpload } from "./FileUpload";
import { Info, Plus, Minus, BookOpen, Bookmark } from "lucide-react";

export function CoverGenerator({ setCoverData, coverData = {} }) {
  const [includesCover, setIncludesCover] = useState(
    coverData.incluirCaratula || false
  );
  const [institutionType, setInstitutionType] = useState(
    coverData.tipoInstitucion || ""
  );
  const [selectedTemplate, setSelectedTemplate] = useState(
    coverData.templateStyle || "style1"
  );
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Arrays para estudiantes según tipo de institución
  const [schoolStudents, setSchoolStudents] = useState(
    coverData.estudiantesColegio?.length
      ? coverData.estudiantesColegio
      : [{ nombre: "", orden: "" }]
  );
  const [universityStudents, setUniversityStudents] = useState(
    coverData.estudiantesUniversidad?.length
      ? coverData.estudiantesUniversidad
      : [{ nombre: "", codigo: "" }]
  );
  const [instituteStudents, setInstituteStudents] = useState(
    coverData.estudiantesInstituto?.length
      ? coverData.estudiantesInstituto
      : [{ nombre: "", codigo: "" }]
  );

  // Función para verificar si los campos obligatorios están completos
  const validateRequiredFields = () => {
    if (!institutionType) return false;

    let requiredFields = {};
    switch (institutionType) {
      case "colegio":
        requiredFields = {
          nombreColegio: coverData.nombreColegio || "",
          tituloTrabajoColegio: coverData.tituloTrabajoColegio || "",
          estudiantes: schoolStudents[0]?.nombre || "",
        };
        break;
      case "universidad":
        requiredFields = {
          nombreUniversidad: coverData.nombreUniversidad || "",
          tituloTrabajoUniversidad: coverData.tituloTrabajoUniversidad || "",
          estudiantes: universityStudents[0]?.nombre || "",
        };
        break;
      case "instituto":
        requiredFields = {
          nombreInstituto: coverData.nombreInstituto || "",
          tituloTrabajoInstituto: coverData.tituloTrabajoInstituto || "",
          estudiantes: instituteStudents[0]?.nombre || "",
        };
        break;
      default:
        return false;
    }

    return !Object.values(requiredFields).some((value) => !value.trim());
  };

  // Efecto para actualizar los datos del componente padre
  useEffect(() => {
    if (!includesCover) {
      setCoverData({ incluirCaratula: false });
      return;
    }

    setCoverData({
      incluirCaratula: includesCover,
      tipoInstitucion: institutionType,
      templateStyle: selectedTemplate,
      nombreColegio: coverData.nombreColegio || "",
      tituloTrabajoColegio: coverData.tituloTrabajoColegio || "",
      cursoColegio: coverData.cursoColegio || "",
      docenteColegio: coverData.docenteColegio || "",
      estudiantesColegio: schoolStudents,
      gradoColegio: coverData.gradoColegio || "",
      seccionColegio: coverData.seccionColegio || "",
      logoColegio: coverData.logoColegio || null,
      nombreUniversidad: coverData.nombreUniversidad || "",
      facultad: coverData.facultad || "",
      carreraUniversidad: coverData.carreraUniversidad || "",
      tituloTrabajoUniversidad: coverData.tituloTrabajoUniversidad || "",
      docenteUniversidad: coverData.docenteUniversidad || "",
      estudiantesUniversidad: universityStudents,
      logoUniversidad: coverData.logoUniversidad || null,
      nombreInstituto: coverData.nombreInstituto || "",
      programaInstituto: coverData.programaInstituto || "",
      tituloTrabajoInstituto: coverData.tituloTrabajoInstituto || "",
      docenteInstituto: coverData.docenteInstituto || "",
      estudiantesInstituto: instituteStudents,
      logoInstituto: coverData.logoInstituto || null,
    });
  }, [
    includesCover,
    institutionType,
    selectedTemplate,
    schoolStudents,
    universityStudents,
    instituteStudents,
    coverData.nombreColegio,
    coverData.tituloTrabajoColegio,
    coverData.cursoColegio,
    coverData.docenteColegio,
    coverData.gradoColegio,
    coverData.seccionColegio,
    coverData.logoColegio,
    coverData.nombreUniversidad,
    coverData.facultad,
    coverData.carreraUniversidad,
    coverData.tituloTrabajoUniversidad,
    coverData.docenteUniversidad,
    coverData.logoUniversidad,
    coverData.nombreInstituto,
    coverData.programaInstituto,
    coverData.tituloTrabajoInstituto,
    coverData.docenteInstituto,
    coverData.logoInstituto,
  ]);

  // Verificar campos y mostrar selector de plantillas si es necesario
  useEffect(() => {
    if (includesCover && validateRequiredFields()) {
      setShowTemplateSelector(true);
    } else {
      setShowTemplateSelector(false);
    }
  }, [
    includesCover,
    institutionType,
    coverData,
    schoolStudents,
    universityStudents,
    instituteStudents,
  ]);

  // Funciones para agregar/eliminar estudiantes
  const addStudent = (type) => {
    switch (type) {
      case "colegio":
        setSchoolStudents([...schoolStudents, { nombre: "", orden: "" }]);
        break;
      case "universidad":
        setUniversityStudents([
          ...universityStudents,
          { nombre: "", codigo: "" },
        ]);
        break;
      case "instituto":
        setInstituteStudents([
          ...instituteStudents,
          { nombre: "", codigo: "" },
        ]);
        break;
    }
  };

  const removeStudent = (type, index) => {
    if (index === 0) return; // No eliminar el primer estudiante

    switch (type) {
      case "colegio":
        setSchoolStudents(schoolStudents.filter((_, i) => i !== index));
        break;
      case "universidad":
        setUniversityStudents(universityStudents.filter((_, i) => i !== index));
        break;
      case "instituto":
        setInstituteStudents(instituteStudents.filter((_, i) => i !== index));
        break;
    }
  };

  // Funciones para actualizar datos de estudiantes
  const updateSchoolStudent = (index, field, value) => {
    const newStudents = [...schoolStudents];
    newStudents[index] = { ...newStudents[index], [field]: value };
    setSchoolStudents(newStudents);
  };

  const updateUniversityStudent = (index, field, value) => {
    const newStudents = [...universityStudents];
    newStudents[index] = { ...newStudents[index], [field]: value };
    setUniversityStudents(newStudents);
  };

  const updateInstituteStudent = (index, field, value) => {
    const newStudents = [...instituteStudents];
    newStudents[index] = { ...newStudents[index], [field]: value };
    setInstituteStudents(newStudents);
  };

  // Función para manejar los archivos de logo
  const handleLogoUpload = (file, institution) => {
    setCoverData((prev) => ({
      ...prev,
      [`logo${institution}`]: file,
    }));
  };

  // Componente para manejar la carga de archivos de logo
  const LogoUploader = ({ institution }) => (
    <div className="space-y-2">
      <Label>Logotipo (opcional)</Label>
      <FileUpload
        onFileChange={(file) => handleLogoUpload(file, institution)}
        accept="image/*"
      />
      {coverData[`logo${institution}`] && (
        <div className="mt-2">
          <img
            src={URL.createObjectURL(coverData[`logo${institution}`])}
            alt="Logo preview"
            className="max-h-20 rounded border p-1"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="incluirCaratula"
          checked={includesCover}
          onCheckedChange={setIncludesCover}
        />
        <Label
          htmlFor="incluirCaratula"
          className="text-base font-medium cursor-pointer"
        >
          ¿Incluir carátula?
        </Label>
      </div>

      {includesCover && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-3">
            <Label className="text-base">Tipo de institución</Label>
            <Select value={institutionType} onValueChange={setInstitutionType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona tipo de institución" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="colegio">Colegio</SelectItem>
                <SelectItem value="universidad">Universidad</SelectItem>
                <SelectItem value="instituto">Instituto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {institutionType === "colegio" && (
            <Card className="border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre del colegio *</Label>
                    <Input
                      placeholder="Nombre del colegio"
                      value={coverData.nombreColegio || ""}
                      onChange={(e) =>
                        setCoverData({
                          ...coverData,
                          nombreColegio: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Título del trabajo *</Label>
                    <Input
                      placeholder="Título del trabajo"
                      value={coverData.tituloTrabajoColegio || ""}
                      onChange={(e) =>
                        setCoverData({
                          ...coverData,
                          tituloTrabajoColegio: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Curso</Label>
                    <Input
                      placeholder="Nombre del curso"
                      value={coverData.cursoColegio || ""}
                      onChange={(e) =>
                        setCoverData({
                          ...coverData,
                          cursoColegio: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre del docente</Label>
                    <Input
                      placeholder="Nombre del docente"
                      value={coverData.docenteColegio || ""}
                      onChange={(e) =>
                        setCoverData({
                          ...coverData,
                          docenteColegio: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Estudiante(s) *</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addStudent("colegio")}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Agregar estudiante
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {schoolStudents.map((student, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          placeholder="Nombre del estudiante"
                          value={student.nombre}
                          onChange={(e) =>
                            updateSchoolStudent(index, "nombre", e.target.value)
                          }
                          className="flex-1"
                        />
                        <Input
                          placeholder="N° de orden"
                          value={student.orden}
                          onChange={(e) =>
                            updateSchoolStudent(index, "orden", e.target.value)
                          }
                          className="w-28"
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => removeStudent("colegio", index)}
                            className="flex-shrink-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Grado</Label>
                    <Input
                      placeholder="Grado"
                      value={coverData.gradoColegio || ""}
                      onChange={(e) =>
                        setCoverData({
                          ...coverData,
                          gradoColegio: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sección</Label>
                    <Input
                      placeholder="Sección"
                      value={coverData.seccionColegio || ""}
                      onChange={(e) =>
                        setCoverData({
                          ...coverData,
                          seccionColegio: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <LogoUploader institution="Colegio" />
              </CardContent>
            </Card>
          )}

          {institutionType === "universidad" && (
            <Card className="border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre de la universidad *</Label>
                    <Input
                      placeholder="Nombre de la universidad"
                      value={coverData.nombreUniversidad || ""}
                      onChange={(e) =>
                        setCoverData({
                          ...coverData,
                          nombreUniversidad: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Facultad</Label>
                    <Input
                      placeholder="Nombre de la facultad"
                      value={coverData.facultad || ""}
                      onChange={(e) =>
                        setCoverData({ ...coverData, facultad: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Carrera</Label>
                    <Input
                      placeholder="Nombre de la carrera"
                      value={coverData.carreraUniversidad || ""}
                      onChange={(e) =>
                        setCoverData({
                          ...coverData,
                          carreraUniversidad: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Título del trabajo *</Label>
                    <Input
                      placeholder="Título del trabajo"
                      value={coverData.tituloTrabajoUniversidad || ""}
                      onChange={(e) =>
                        setCoverData({
                          ...coverData,
                          tituloTrabajoUniversidad: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nombre del docente</Label>
                  <Input
                    placeholder="Nombre del docente"
                    value={coverData.docenteUniversidad || ""}
                    onChange={(e) =>
                      setCoverData({
                        ...coverData,
                        docenteUniversidad: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Estudiante(s) *</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addStudent("universidad")}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Agregar estudiante
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {universityStudents.map((student, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          placeholder="Nombre del estudiante"
                          value={student.nombre}
                          onChange={(e) =>
                            updateUniversityStudent(
                              index,
                              "nombre",
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                        <Input
                          placeholder="Código de estudiante"
                          value={student.codigo}
                          onChange={(e) =>
                            updateUniversityStudent(
                              index,
                              "codigo",
                              e.target.value
                            )
                          }
                          className="w-40"
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => removeStudent("universidad", index)}
                            className="flex-shrink-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <LogoUploader institution="Universidad" />
              </CardContent>
            </Card>
          )}

          {institutionType === "instituto" && (
            <Card className="border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre del instituto *</Label>
                    <Input
                      placeholder="Nombre del instituto"
                      value={coverData.nombreInstituto || ""}
                      onChange={(e) =>
                        setCoverData({
                          ...coverData,
                          nombreInstituto: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Programa o especialidad</Label>
                    <Input
                      placeholder="Programa o especialidad"
                      value={coverData.programaInstituto || ""}
                      onChange={(e) =>
                        setCoverData({
                          ...coverData,
                          programaInstituto: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Título del trabajo *</Label>
                  <Input
                    placeholder="Título del trabajo"
                    value={coverData.tituloTrabajoInstituto || ""}
                    onChange={(e) =>
                      setCoverData({
                        ...coverData,
                        tituloTrabajoInstituto: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nombre del docente</Label>
                  <Input
                    placeholder="Nombre del docente"
                    value={coverData.docenteInstituto || ""}
                    onChange={(e) =>
                      setCoverData({
                        ...coverData,
                        docenteInstituto: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Estudiante(s) *</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addStudent("instituto")}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Agregar estudiante
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {instituteStudents.map((student, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          placeholder="Nombre del estudiante"
                          value={student.nombre}
                          onChange={(e) =>
                            updateInstituteStudent(
                              index,
                              "nombre",
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                        <Input
                          placeholder="Código o matrícula"
                          value={student.codigo}
                          onChange={(e) =>
                            updateInstituteStudent(
                              index,
                              "codigo",
                              e.target.value
                            )
                          }
                          className="w-40"
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => removeStudent("instituto", index)}
                            className="flex-shrink-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <LogoUploader institution="Instituto" />
              </CardContent>
            </Card>
          )}

          {showTemplateSelector && (
            <div className="space-y-4 animate-fade-in border rounded-lg p-6 bg-muted/20">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">
                  Selecciona un diseño de carátula
                </h3>
              </div>
              <p className="text-muted-foreground">
                Escoge el estilo que mejor se adapte a tu trabajo
              </p>

              <RadioGroup
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div
                    key={num}
                    className={`relative border rounded-lg p-2 transition-all ${
                      selectedTemplate === `style${num}`
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <div className="aspect-[3/4] bg-muted/30 rounded-md flex items-center justify-center mb-2 overflow-hidden">
                      <img
                        src={`/assets/caratula_${num}.jpg`}
                        alt={`Diseño ${num}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/api/placeholder/300/400";
                        }}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={`style${num}`}
                        id={`style${num}`}
                      />
                      <Label
                        htmlFor={`style${num}`}
                        className="font-medium cursor-pointer"
                      >
                        {num === 1 && "Estilo Clásico"}
                        {num === 2 && "Estilo Moderno"}
                        {num === 3 && "Estilo Minimalista"}
                        {num === 4 && "Estilo Académico"}
                        {num === 5 && "Estilo Profesional"}
                        {num === 6 && "Estilo Creativo"}
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
                <div className="flex gap-2">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-700">
                      La carátula se generará automáticamente con tus datos y se
                      incluirá en el documento final.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CoverGenerator;
