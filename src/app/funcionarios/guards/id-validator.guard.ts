import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class IdValidatorGuard implements CanActivate {

  constructor(
    private router: Router // eh o objeto responsavel por fazer o roteamento das paginas pelo TS
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, // vc tem acesso aos parametros da rota
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

     /* se idFuncionario for um numero -> Permita entrar na pagina
     se idFuncionario nao for um numero -> nao permita entrar na pagina

     isNAN() vai te informar se o valor qu e vc passou como parametro nao eh um numero */
    const idFuncionario = Number(route.paramMap.get('idFuncionario') as string)

    if (isNaN(idFuncionario)) {
      return this.router.parseUrl('/funcionarios')
    }

    return true;
  }

}
