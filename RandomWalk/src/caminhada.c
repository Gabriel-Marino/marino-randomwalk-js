//criado em				:	2020.01.30
//ult. atualização		:	2020.01.30
//autor					:	Breno <breno@dfi.uem.br>
//coautor				:	Marino <ra115114@uem.br>
//notas					:

#include "../head.h"

void op(int t, struct intble *p);

int main(int argc,char **argv){

	int i, j, n, o, t;
	int n_m= 0;
	int n_f= 0;
	double d, dx, dy, th, x_cm, y_cm, x1, x2, y1, y2, t1, t2;
	double act;
	struct intble *p= calloc(N, sizeof(struct intble));
	FILE *file;
	char nome[100];

	gsl_rng_default_seed= (argc == 2) ? atoi(argv[1]) : time(NULL);
	gsl_rng *w= gsl_rng_alloc(gsl_rng_taus);

	for(i= 0; i< N; i++){
		p[i].s= 2.0*gsl_rng_uniform(w)+1.0;
		p[i].x= gsl_rng_uniform(w);
		p[i].y= gsl_rng_uniform(w);
	}

	op(0, p);

	for(i=0; i< N; i++){
		if(p[i].s == 1){
			n_f++;
		}else{
			n_m++;
		}
	}

	file= fopen("dst.dat", "a");
	fprintf(file, "%e %e\n", 1.0*n_f/N, 1.0*n_m/N);
	fclose(file);

	for(t= 1; t< NG; t++){
		for(i= 0; i< N; i++){
			do{
				n= gsl_rng_uniform(w)*N;
			}while(p[n].s == 0);
//		mobilidade - começo;
			th= 2.0*M_PI*gsl_rng_uniform(w);
			p[n].x+= l*cos(th);
			if(p[n].x> L  ){p[n].x-= L;};
			if(p[n].x< 0.0){p[n].x+= L;};
			p[n].y+= l*sin(th);
			if(p[n].y> L  ){p[n].y-= L;};
			if(p[n].y< 0.0){p[n].x+= L;};
//		mobilidade - fim.
//		ação - começo;
			act= gsl_rng_uniform(w);
			if(act< pr){
//		reprodução - começo;
				o= 0;
				d= L;
				for(j= 0; j< N; j++){
					if(p[j].s != p[n].s && p[j].s != 0){
						dx= fabs(p[j].x-p[n].x);
						if(dx> 0.5*L){dx-= L;};
						dy= fabs(p[j].y-p[j].y);
						if(dy> 0.5*L){dy-= L;};
						if(sqrt(dx*dx+dy*dy)< d){
							d= sqrt(dx*dx+dy*dy);
							o= j;
						};
					}
				}
				if(l>= d){
					for(j=0; j< N; j++){
						if(p[j].s == 0){
							p[j].s= 2.0*gsl_rng_uniform(w)+1.0;
							if(p[j].s == 1){
								n_f++;
							}else{
								n_m++;
							};
							th= 2.0*M_PI*gsl_rng_uniform(w);
							if(p[n].s == 1){
								p[j].x= p[n].x+l*cos(th);
								if(p[j].x> L  ){p[j].x-= L;};
								if(p[j].x< 0.0){p[j].x+= L;};
								p[j].y= p[n].y+l*cos(th);
								if(p[j].y> L  ){p[j].y-= L;};
								if(p[j].y< 0.0){p[j].y+= L;};
							}else{
								p[j].x= p[o].x+l*cos(th);
								if(p[j].x> L  ){p[j].x-= L;};
								if(p[j].x< 0.0){p[j].x+= L;};
								p[j].y= p[o].y+l*cos(th);
								if(p[j].y> L  ){p[j].y-= L;};
								if(p[j].y< 0.0){p[j].y+= L;};	
							};
							j= N;
						};
					};
				};
//		reprodução - fim.
			}else{
//		morte - começo;
				if(p[n].s == 1){
					n_f--;
				}else{
					n_m--;
				}
				p[n].s= 0;
//		morte - fim.
			}
		}
		op(t, p);
		file= fopen("dst.dat", "a");
		fprintf(file, "%e %e\n", 1.0*n_f/N, 1.0*n_m/N);
		fclose(file);
		if(t%10 == 0){
			printf("%d%%\n",t/10);
		};
	}

	gsl_rng_free(w);
	free(p);
	return 0;
}