#include "convex_hull.h"
#include <algorithm>

vector<AlgorithmicStep> grahamScan(vector<Point> points) {
    vector<AlgorithmicStep> steps;
    vector<Point> discarded_points;
    auto recordStep = [&](const string& desc, const vector<Point>& current_hull, const vector<Point>& active_pts, const vector<Line>& active_lns) {
        AlgorithmicStep step;
        step.description=desc;
        step.hull=current_hull;
        step.active=active_pts;
        step.discarded=discarded_points;
        step.activeLines=active_lns;
        steps.push_back(step);
    };
    vector<Point> unique_points;
    for(const auto& p:points) {
        bool is_duplicate=false;
        for(const auto& up:unique_points){
            if(up.x==p.x&&up.y==p.y){
                is_duplicate=true;
                break;
            }
        }
        if(!is_duplicate){
            unique_points.push_back(p);
        }
    }
    if(unique_points.size()!=points.size()) {
        AlgorithmicStep step;
        step.description="Removed "+to_string(points.size()-unique_points.size())+ " duplicate point(s).";
        step.hull=unique_points;
        steps.push_back(step);
        points=unique_points;
    }
    if(points.size()<3) {
        AlgorithmicStep step;
        step.description="Cannot compute convex hull: Less than 3 unique points.";
        step.hull=points;
        steps.push_back(step);
        return steps;
    }

    // find anchor point (bottom-leftmost: maximum Y, minimum X on screen)
    int anchor_idx=0;
    for(size_t i=1;i<points.size();i++) {
        if(points[i].y>points[anchor_idx].y|| 
            (points[i].y==points[anchor_idx].y&&points[i].x<points[anchor_idx].x)) {
            anchor_idx=i;
        }
    }
    Point anchor=points[anchor_idx];
    swap(points[0],points[anchor_idx]);
    vector<Point> current_hull={anchor};
    recordStep("Selected anchor point P" + anchor.id + " (" + to_string(anchor.x) + ", " + to_string(anchor.y) + ") as the lowest-leftmost point.", current_hull, { anchor }, {});

    // sort points by clockwise order relative to anchor
    sort(points.begin() + 1, points.end(), [anchor](const Point& a, const Point& b) {
        return comparePolarAngle(anchor, a, b);
    });

    vector<Point> sorted_active;
    for(size_t i=1;i<points.size();i++) {
        sorted_active.push_back(points[i]);
    }
    recordStep("Sorted other points clockwise relative to the anchor.", current_hull, sorted_active, {});

    // run the stack scan
    vector<Point> stack={points[0],points[1]};
    recordStep("Pushed first sorted point P" + points[1].id + " onto the stack.", stack, { points[0], points[1] }, { {points[0], points[1]} });

    for(size_t i=2;i<points.size();i++) {
        Point next_pt=points[i];
        while(stack.size()>=2) {
            Point top=stack.back();
            Point second_top=stack[stack.size()-2];
            double orient=getOrientation(second_top,top,next_pt);
            vector<Point> active_pts={second_top,top,next_pt};
            vector<Line> active_lns={{second_top,top},{top,next_pt}};
            if(orient>0) {
                recordStep("Checking turn: P" + second_top.id + " -> P" + top.id + " -> P" + next_pt.id + 
                           " is a clockwise turn (orientation > 0). Keep P" + top.id + ".", stack, active_pts, active_lns);
                break;
            } else {
                string reason=(orient==0)?"collinear":"a counter-clockwise turn";
                recordStep("Checking turn: P" + second_top.id + " -> P" + top.id + " -> P" + next_pt.id + 
                           " is " + reason + " (orientation <= 0). Pop P" + top.id + " from the hull.", stack, active_pts, active_lns);
                discarded_points.push_back(top);
                stack.pop_back();
                recordStep("Popped P" + top.id + " from the hull.", stack, { second_top, next_pt }, { {second_top, next_pt} });
            }
        }

        stack.push_back(next_pt);
        vector<Line> current_lns;
        for(size_t k=0;k<stack.size()-1;k++){
            current_lns.push_back({stack[k],stack[k+1]});
        }
        recordStep("Pushed P" + next_pt.id + " onto the hull stack.", stack, { next_pt }, current_lns);
    }
    // complete polygon
    vector<Line> final_lns;
    for(size_t k=0;k<stack.size()-1;k++) {
        final_lns.push_back({stack[k],stack[k+1]});
    }
    final_lns.push_back({stack.back(),stack[0]});
    recordStep("Convex Hull completed! Total points on hull: " + to_string(stack.size()), stack, {}, final_lns);
    return steps;
}
