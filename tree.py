import os

def mostrar_estructura(ruta='.', nivel=0):
    # Lista elementos en el directorio actual
    elementos = os.listdir(ruta)
    elementos.sort()
    
    for elemento in elementos:
        # Ignorar node_modules y archivos ocultos
        if elemento == 'node_modules' or elemento.startswith('.'):
            continue
            
        ruta_completa = os.path.join(ruta, elemento)
        
        # Imprimir el elemento actual
        print('    ' * nivel + '|-- ' + elemento)
        
        # Si es un directorio, procesar recursivamente
        if os.path.isdir(ruta_completa):
            mostrar_estructura(ruta_completa, nivel + 1)

print("\nEstructura del proyecto:\n")
mostrar_estructura()