#include "convex_hull.h"
#include <algorithm>
vector<AlgorithmicStep> jarvisMarch(vector<Point> points){
    vector<AlgorithmicStep> steps;
    vector<Point> discarded_points;
    auto recordStep=[&](const string& desc,const vector<Point>& current_hull,const vector<Point>& active_pts,const vector<Line>& active_lns){
        AlgorithmicStep step;
        step.description=desc;
        step.hull=current_hull;
        step.active=active_pts;
        step.discarded=discarded_points;
        step.activeLines=active_lns;
        steps.push_back(step);
    };
    vector<Point> unique_points;
    for(const auto& p:points){
        bool is_duplicate=false;
        for(const auto& up:unique_points){
            if(up.x==p.x&&up.y==p.y){
                is_duplicate=true;
                break;
            }
        }
        if(!is_duplicate)unique_points.push_back(p);
    }
    if(unique_points.size()!=points.size()){
        AlgorithmicStep step;
        step.description="Removed "+to_string(points.size()-unique_points.size())+" duplicate point(s).";
        step.hull=unique_points;
        steps.push_back(step);
        points=unique_points;
    }
    if(points.size()<3){
        AlgorithmicStep step;
        step.description="Cannot compute convex hull: Less than 3 unique points.";
        step.hull=points;
        steps.push_back(step);
        return steps;
    }
    int leftmost_idx=0;
    for(size_t i=1;i<points.size();i++){
        if(points[i].x<points[leftmost_idx].x||(points[i].x==points[leftmost_idx].x&&points[i].y>points[leftmost_idx].y)){
            leftmost_idx=i;
        }
    }
    int current_idx=leftmost_idx;
    vector<Point> hull_points;
    do{
        hull_points.push_back(points[current_idx]);
        int next_idx=(current_idx+1)%points.size();
        recordStep("Searching for the next hull point starting from P"+points[current_idx].id+".",hull_points,{points[current_idx],points[next_idx]},{{points[current_idx],points[next_idx]}});
        for(size_t i=0;i<points.size();i++){
            if(i==current_idx||i==next_idx)continue;
            double orient=getOrientation(points[current_idx],points[next_idx],points[i]);
            bool update=false;
            string reason="";
            if(orient>0){
                update=true;
                reason="P"+points[i].id+" is clockwise compared to candidate P"+points[next_idx].id;
            }else if(orient==0){
                if(getSquaredDistance(points[current_idx],points[i])>getSquaredDistance(points[current_idx],points[next_idx])){
                    update=true;
                    reason="P"+points[i].id+" is collinear but further than candidate P"+points[next_idx].id;
                }
            }
            string cmp_desc="Comparing candidate P"+points[next_idx].id+" with P"+points[i].id+". "+(update?"Updating candidate to P"+points[i].id+" because "+reason:"Keeping candidate P"+points[next_idx].id+".");
            recordStep(cmp_desc,hull_points,{points[current_idx],points[next_idx],points[i]},{{points[current_idx],points[next_idx]},{points[current_idx],points[i]}});
            if(update)next_idx=i;
        }
        current_idx=next_idx;
        if(current_idx!=leftmost_idx){
            recordStep("Found next hull point: P"+points[current_idx].id+". Appending it to the hull.",hull_points,{points[current_idx]},{});
        }
    }while(current_idx!=leftmost_idx);
    vector<Line> final_lns;
    for(size_t k=0;k<hull_points.size()-1;k++){
        final_lns.push_back({hull_points[k],hull_points[k+1]});
    }
    final_lns.push_back({hull_points.back(),hull_points[0]});
    recordStep("Convex Hull completed! Total points on hull: "+to_string(hull_points.size()),hull_points,{},final_lns);
    return steps;
}
