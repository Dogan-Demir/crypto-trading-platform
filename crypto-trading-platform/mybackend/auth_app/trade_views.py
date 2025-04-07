from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from decimal import Decimal
from .models import Transaction, Portfolio, Cryptocurrency
from django.db import transaction

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def execute_trade(request):
    try:
        crypto_id = request.data.get('cryptocurrency_id')
        amount = Decimal(str(request.data.get('amount')))
        trade_type = request.data.get('trade_type')

        if not all([crypto_id, amount, trade_type]) or amount <= 0:
            return Response(
                {'detail': 'Invalid trade parameters'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            crypto = Cryptocurrency.objects.get(id=crypto_id)
            user = request.user
            profile = user.userprofile
            total_cost = amount * crypto.current_price

            if trade_type == 'BUY':
                # Check if user has enough balance
                if profile.balance < total_cost:
                    return Response(
                        {'detail': 'Insufficient funds'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Update user's balance
                profile.balance -= total_cost
                profile.save()

                # Update or create portfolio entry
                portfolio, created = Portfolio.objects.get_or_create(
                    user=user,
                    cryptocurrency=crypto,
                    defaults={'amount': 0}
                )
                portfolio.amount += amount
                portfolio.save()

            elif trade_type == 'SELL':
                # Check if user has enough crypto
                try:
                    portfolio = Portfolio.objects.get(
                        user=user,
                        cryptocurrency=crypto
                    )
                    if portfolio.amount < amount:
                        return Response(
                            {'detail': 'Insufficient cryptocurrency balance'}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except Portfolio.DoesNotExist:
                    return Response(
                        {'detail': 'No cryptocurrency balance'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Update user's balance
                profile.balance += total_cost
                profile.save()

                # Update portfolio
                portfolio.amount -= amount
                portfolio.save()

            # Record the transaction
            Transaction.objects.create(
                user=user,
                cryptocurrency=crypto,
                transaction_type=trade_type,
                amount=amount,
                price_at_transaction=crypto.current_price
            )

            return Response({
                'status': 'success',
                'message': f'{trade_type} order executed successfully',
                'amount': float(amount),
                'total_cost': float(total_cost),
                'new_balance': float(profile.balance)
            })

    except Cryptocurrency.DoesNotExist:
        return Response(
            {'detail': 'Cryptocurrency not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'detail': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def trade(request):
    try:
        crypto_id = request.data.get('cryptocurrency_id')
        amount = Decimal(str(request.data.get('amount')))
        trade_type = request.data.get('trade_type')

        if not all([crypto_id, amount, trade_type]) or amount <= 0:
            return Response(
                {'detail': 'Invalid trade parameters'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            crypto = Cryptocurrency.objects.get(id=crypto_id)
            user = request.user
            profile = user.userprofile
            total_cost = amount * crypto.current_price

            if trade_type == 'BUY':
                # Check if user has enough balance
                if profile.balance < total_cost:
                    return Response(
                        {'detail': 'Insufficient funds'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Update user's balance
                profile.balance -= total_cost
                profile.save()

                # Update or create portfolio entry
                portfolio, created = Portfolio.objects.get_or_create(
                    user=user,
                    cryptocurrency=crypto,
                    defaults={'amount': 0}
                )
                portfolio.amount += amount
                portfolio.save()

            elif trade_type == 'SELL':
                # Check if user has enough crypto
                try:
                    portfolio = Portfolio.objects.get(
                        user=user,
                        cryptocurrency=crypto
                    )
                    if portfolio.amount < amount:
                        return Response(
                            {'detail': 'Insufficient cryptocurrency balance'}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except Portfolio.DoesNotExist:
                    return Response(
                        {'detail': 'No cryptocurrency balance'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Update user's balance
                profile.balance += total_cost
                profile.save()

                # Update portfolio
                portfolio.amount -= amount
                portfolio.save()

            # Record the transaction
            Transaction.objects.create(
                user=user,
                cryptocurrency=crypto,
                transaction_type=trade_type,
                amount=amount,
                price_at_transaction=crypto.current_price
            )

            return Response({
                'status': 'success',
                'message': f'{trade_type} order executed successfully',
                'amount': float(amount),
                'total_cost': float(total_cost),
                'new_balance': float(profile.balance)
            })

    except Cryptocurrency.DoesNotExist:
        return Response(
            {'detail': 'Cryptocurrency not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'detail': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        ) 