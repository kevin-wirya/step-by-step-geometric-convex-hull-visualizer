#ifndef CONVEX_HULL_H
#define CONVEX_HULL_H
#include "point.h"
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

double getOrientation(Point p1, Point p2, Point p3);
double getSquaredDistance(Point p1, Point p2);
bool comparePolarAngle(Point anchor, Point p1, Point p2);

#endif
