import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GPodeSairComponent } from '../components/g-pode-sair/g-pode-sair.component';
import { FuncionarioComponent } from '../pages/funcionario/funcionario.component';

@Injectable({
  providedIn: 'root'
})

export class PodeSairGuard implements CanDeactivate<FuncionarioComponent> {

  constructor(
    private dialog: MatDialog
  ) {}

  canDeactivate(
    component: FuncionarioComponent, // representa o componente que ele esta inserido
    currentRoute: ActivatedRouteSnapshot, // a partir dele conseguimos acessar o valor dos parametros
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // se o guard retornar o valor TRUE, significa que a pessoa PODE sair da pagina
    // se o guard retornar o valor FALSE, significa que a pessoa NAO PODE sair da pagina

    // 1- Pegar os dados do formulario e guardar cada um em variaveis diferentes
    const nome = component.formFuncionario.value.nome
    const email = component.formFuncionario.value.email
    const foto = component.formFuncionario.value.foto

    if (nome != component.funcionario.nome || email != component.funcionario.email || foto.length > 0){
      const dialogRef = this.dialog.open(GPodeSairComponent)
      
      return dialogRef.afterClosed()
    }
    return true    
  }
  
}
