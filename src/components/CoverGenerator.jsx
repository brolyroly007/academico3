// src/components/CoverGenerator.jsx - Actualizado completamente
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
import { Info, Plus, Minus, BookOpen } from "lucide-react";
import { ImageSearcher } from "@/components/ImageSearcher";

export function CoverGenerator({ setCoverData, coverData = {} }) {
  const [includesCover, setIncludesCover] = useState(
    coverData.incluirCaratula || false
  );
  const [institutionType, setInstitutionType] = useState(
    coverData.tipoInstitucion || ""
  );
  // Establecer una plantilla predeterminada fija (style1)
  const selectedTemplate = "style1";

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

  // Función para convertir texto a mayúsculas
  const toUpperCase = (text) => {
    return text.toUpperCase();
  };

  // Función para manejar la selección de logo
  const handleLogoSelect = (logoUrl) => {
    setCoverData({
      ...coverData,
      logoUrl: logoUrl,
    });
  };

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
      templateStyle: selectedTemplate, // Siempre usará la plantilla predeterminada
      nombreColegio: coverData.nombreColegio || "",
      tituloTrabajoColegio: coverData.tituloTrabajoColegio || "",
      cursoColegio: coverData.cursoColegio || "",
      docenteColegio: coverData.docenteColegio || "",
      estudiantesColegio: schoolStudents,
      gradoColegio: coverData.gradoColegio || "",
      seccionColegio: coverData.seccionColegio || "",
      nombreUniversidad: coverData.nombreUniversidad || "",
      facultad: coverData.facultad || "",
      carreraUniversidad: coverData.carreraUniversidad || "",
      tituloTrabajoUniversidad: coverData.tituloTrabajoUniversidad || "",
      docenteUniversidad: coverData.docenteUniversidad || "",
      estudiantesUniversidad: universityStudents,
      nombreInstituto: coverData.nombreInstituto || "",
      programaInstituto: coverData.programaInstituto || "",
      tituloTrabajoInstituto: coverData.tituloTrabajoInstituto || "",
      docenteInstituto: coverData.docenteInstituto || "",
      estudiantesInstituto: instituteStudents,
      logoUrl: coverData.logoUrl || "",
    });
  }, [
    includesCover,
    institutionType,
    schoolStudents,
    universityStudents,
    instituteStudents,
    coverData.nombreColegio,
    coverData.tituloTrabajoColegio,
    coverData.cursoColegio,
    coverData.docenteColegio,
    coverData.gradoColegio,
    coverData.seccionColegio,
    coverData.nombreUniversidad,
    coverData.facultad,
    coverData.carreraUniversidad,
    coverData.tituloTrabajoUniversidad,
    coverData.docenteUniversidad,
    coverData.nombreInstituto,
    coverData.programaInstituto,
    coverData.tituloTrabajoInstituto,
    coverData.docenteInstituto,
    coverData.logoUrl,
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
    newStudents[index] = { ...newStudents[index], [field]: toUpperCase(value) };
    setSchoolStudents(newStudents);
  };

  const updateUniversityStudent = (index, field, value) => {
    const newStudents = [...universityStudents];
    newStudents[index] = { ...newStudents[index], [field]: toUpperCase(value) };
    setUniversityStudents(newStudents);
  };

  const updateInstituteStudent = (index, field, value) => {
    const newStudents = [...instituteStudents];
    newStudents[index] = { ...newStudents[index], [field]: toUpperCase(value) };
    setInstituteStudents(newStudents);
  };

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
                          nombreColegio: toUpperCase(e.target.value),
                        })
                      }
                      className="uppercase"
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
                          tituloTrabajoColegio: toUpperCase(e.target.value),
                        })
                      }
                      className="uppercase"
                    />
                  </div>
                </div>

                {/* Búsqueda de logo para colegio */}
                {coverData.nombreColegio && (
                  <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800/50">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            🖼️ Buscar logo del colegio (opcional)
                          </Label>
                        </div>
                        <ImageSearcher
                          onImageSelect={handleLogoSelect}
                          selectedImageUrl={coverData.logoUrl}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Curso</Label>
                    <Input
                      placeholder="Nombre del curso"
                      value={coverData.cursoColegio || ""}
                      onChange={(e) =>
                        setCoverData({
                          ...coverData,
                          cursoColegio: toUpperCase(e.target.value),
                        })
                      }
                      className="uppercase"
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
                          docenteColegio: toUpperCase(e.target.value),
                        })
                      }
                      className="uppercase"
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
                          className="flex-1 uppercase"
                        />
                        <Input
                          placeholder="N° de orden"
                          value={student.orden}
                          onChange={(e) =>
                            updateSchoolStudent(index, "orden", e.target.value)
                          }
                          className="w-28 uppercase"
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
                          gradoColegio: toUpperCase(e.target.value),
                        })
                      }
                      className="uppercase"
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
                          seccionColegio: toUpperCase(e.target.value),
                        })
                      }
                      className="uppercase"
                    />
                  </div>
                </div>
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
                          nombreUniversidad: toUpperCase(e.target.value),
                        })
                      }
                      className="uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Facultad</Label>
                    <Input
                      placeholder="Nombre de la facultad"
                      value={coverData.facultad || ""}
                      onChange={(e) =>
                        setCoverData({
                          ...coverData,
                          facultad: toUpperCase(e.target.value),
                        })
                      }
                      className="uppercase"
                    />
                  </div>
                </div>

                {/* Búsqueda de logo para universidad */}
                {coverData.nombreUniversidad && (
                  <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800/50">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <Label className="text-sm font-medium text-green-700 dark:text-green-300">
                            🖼️ Buscar logo de la universidad (opcional)
                          </Label>
                        </div>
                        <ImageSearcher
                          onImageSelect={handleLogoSelect}
                          selectedImageUrl={coverData.logoUrl}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Carrera</Label>
                    <Input
                      placeholder="Nombre de la carrera"
                      value={coverData.carreraUniversidad || ""}
                      onChange={(e) =>
                        setCoverData({
                          ...coverData,
                          carreraUniversidad: toUpperCase(e.target.value),
                        })
                      }
                      className="uppercase"
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
                          tituloTrabajoUniversidad: toUpperCase(e.target.value),
                        })
                      }
                      className="uppercase"
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
                        docenteUniversidad: toUpperCase(e.target.value),
                      })
                    }
                    className="uppercase"
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
                          className="flex-1 uppercase"
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
                          className="w-40 uppercase"
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
                          nombreInstituto: toUpperCase(e.target.value),
                        })
                      }
                      className="uppercase"
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
                          programaInstituto: toUpperCase(e.target.value),
                        })
                      }
                      className="uppercase"
                    />
                  </div>
                </div>

                {/* Búsqueda de logo para instituto */}
                {coverData.nombreInstituto && (
                  <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-900/10 dark:border-purple-800/50">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <Label className="text-sm font-medium text-purple-700 dark:text-purple-300">
                            🖼️ Buscar logo del instituto (opcional)
                          </Label>
                        </div>
                        <ImageSearcher
                          onImageSelect={handleLogoSelect}
                          selectedImageUrl={coverData.logoUrl}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  <Label>Título del trabajo *</Label>
                  <Input
                    placeholder="Título del trabajo"
                    value={coverData.tituloTrabajoInstituto || ""}
                    onChange={(e) =>
                      setCoverData({
                        ...coverData,
                        tituloTrabajoInstituto: toUpperCase(e.target.value),
                      })
                    }
                    className="uppercase"
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
                        docenteInstituto: toUpperCase(e.target.value),
                      })
                    }
                    className="uppercase"
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
                          className="flex-1 uppercase"
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
                          className="w-40 uppercase"
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
              </CardContent>
            </Card>
          )}

          {validateRequiredFields() && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-900 rounded-lg p-4 mt-4">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    La carátula se generará automáticamente con tus datos usando
                    el estilo clásico.
                  </p>
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
