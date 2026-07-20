CC=em++
CFLAGS=-O3 -s WASM=1 --bind -s MODULARIZE=1 -s EXPORT_NAME="createModule" -s ALLOW_MEMORY_GROWTH=1 -Isrc
SOURCES=src/geometry.cpp src/graham_scan.cpp src/jarvis_march.cpp src/quickhull.cpp src/main.cpp
OUTPUT=../public/algorithm_core.js
all: $(SOURCES)
	$(CC) $(CFLAGS) $(SOURCES) -o $(OUTPUT)
clean:
	rm -f $(OUTPUT) ../public/algorithm_core.wasm
