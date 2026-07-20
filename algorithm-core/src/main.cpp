#include <emscripten/bind.h>
#include "convex_hull.h"
using namespace emscripten;
EMSCRIPTEN_BINDINGS(algorithm_core) {
    value_object<Point>("Point")
        .field("x", &Point::x)
        .field("y", &Point::y)
        .field("id", &Point::id);
    value_object<Line>("Line")
        .field("p1", &Line::p1)
        .field("p2", &Line::p2);
    register_vector<Point>("VectorPoint");
    register_vector<Line>("VectorLine");
    register_vector<AlgorithmicStep>("VectorAlgorithmicStep");
    value_object<AlgorithmicStep>("AlgorithmicStep")
        .field("description", &AlgorithmicStep::description)
        .field("hull", &AlgorithmicStep::hull)
        .field("active", &AlgorithmicStep::active)
        .field("discarded", &AlgorithmicStep::discarded)
        .field("activeLines", &AlgorithmicStep::activeLines);
    emscripten::function("grahamScan", &grahamScan);
    emscripten::function("jarvisMarch", &jarvisMarch);
    emscripten::function("quickHull", &quickHull);
}
