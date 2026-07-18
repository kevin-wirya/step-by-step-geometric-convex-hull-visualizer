#ifndef CONVEX_HULL_H
#define CONVEX_HULL_H
#include"point.h"
#include<string>
#include<vector>
using namespace std;
struct Line {
    Point p1, p2;
};
struct AlgorithmicStep {
    string description;
    vector<Point> hull;
    vector<Point> active;
    vector<Point> discarded;
    vector<Line> activeLines;
};
#endif
