#include "convex_hull.h"
#include <cmath>
using namespace std;
double getOrientation(Point p1, Point p2, Point p3) {
    return (p2.x-p1.x)*(p3.y-p1.y)-(p2.y-p1.y)*(p3.x-p1.x);
}
double getSquaredDistance(Point p1, Point p2) {
    double dx=p1.x-p2.x;
    double dy=p1.y-p2.y;
    return dx*dx+dy*dy;
}
bool comparePolarAngle(Point anchor, Point p1, Point p2) {
    double orientation=getOrientation(anchor,p1,p2);
    if (orientation==0)return getSquaredDistance(anchor,p1)<getSquaredDistance(anchor,p2);
    return orientation>0;
}
